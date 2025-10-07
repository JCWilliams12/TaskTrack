export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const isApiError = (err: unknown): err is ApiError => {
  return typeof err === 'object' && err !== null && 'statusCode' in (err as Record<string, unknown>);
};


