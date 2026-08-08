// lib/api/validate.ts

import { NextRequest, NextResponse } from "next/server";
import { ZodType } from "zod";
import { apiError } from "./response";

type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      response: NextResponse;
    };

/**
 * Validates a request body against a Zod schema.
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodType<T>,
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        response: apiError(
          result.error.issues.map((issue) => issue.message).join(", "),
          400,
        ),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      response: apiError("Invalid request body.", 400),
    };
  }
}