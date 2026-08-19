import { NextRequest, NextResponse } from "next/server";
import { ZodType } from "zod";

/**
 * Standard success response
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Resource created
 */
export function apiCreated<T>(data: T) {
  return apiSuccess(data, 201);
}

/**
 * Standard error response
 */
export function apiError(
  message: string,
  status = 400,
  error?: string
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(error && { error }),
    },
    { status }
  );
}

/**
 * No content (DELETE)
 */
export function apiNoContent() {
  return new NextResponse(null, {
    status: 204,
  });
}

/**
 * Paginated response
 */
export function apiPaginated<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
) {
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        ...pagination,
        totalPages: Math.ceil(
          pagination.total / pagination.limit
        ),
      },
    },
    {
      status: 200,
    }
  );
}

/**
 * Validate request body
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: ZodType<T>
): Promise<
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: NextResponse;
    }
> {
  try {
    const body = await req.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: apiError(
          result.error.issues
            .map((issue) => issue.message)
            .join(", "),
          400,
          "VALIDATION_ERROR"
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
      error: apiError(
        "Invalid request body",
        400,
        "INVALID_JSON"
      ),
    };
  }
}