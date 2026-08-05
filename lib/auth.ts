// lib/auth.ts

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { admin, multiSession } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from "./validation";

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;

if (!BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET environment variable is required");
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: BETTER_AUTH_SECRET,
  plugins: [admin(), multiSession(), nextCookies()],
  trustedOrigins: [
    "http://localhost:3000",
  ],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: "CUSTOMER",
            },
          };
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" 
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: () => {
        return {
          role: "CUSTOMER",
        };
      },
    },
  },

  advanced: {
    disableErrorPage: true,
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
    onAPIError: {
      disableErrorPage: true,
    },
  },
});

export type Auth = typeof auth;

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;