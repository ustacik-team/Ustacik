// lib/api/api-exception.ts

export class ApiException extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiException";
  }
}