import { ApiException } from "./api-exception";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { apiError } from "./response";

export function handleApiError(error: unknown) {
  console.error(error);

  if (error instanceof ApiException) {
    return apiError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return apiError(
      error.issues.map((i) => i.message).join(", "),
      400,
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return apiError("A record with this value already exists.", 409);

      case "P2025":
        return apiError("Resource not found.", 404);

      default:
        return apiError("Database error.", 500);
    }
  }

  return apiError("Internal server error", 500);
}