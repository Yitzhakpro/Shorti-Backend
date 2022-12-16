export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpStatusCode;
  public readonly metadata: Record<string, unknown>;
  public readonly isOpeational: boolean;

  constructor(name: string, description: string, httpCode: HttpStatusCode, metadata = {}, isOperational: boolean) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = httpCode;
    this.metadata = metadata;
    this.isOpeational = isOperational;

    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends BaseError {
  constructor(name = 'BAD REQUEST', description = 'Bad Request Error', metadata?: Record<string, unknown>) {
    super(name, description, HttpStatusCode.BAD_REQUEST, metadata, true);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(name = 'UNAUTHORIZED REQUEST', description = 'Unauthorized Error', metadata?: Record<string, unknown>) {
    super(name, description, HttpStatusCode.UNAUTHORIZED, metadata, true);
  }
}

export class ForbiddenError extends BaseError {
  constructor(name = 'FORBIDDEN REQUEST', description = 'Forbidden Error', metadata?: Record<string, unknown>) {
    super(name, description, HttpStatusCode.FORBIDDEN, metadata, true);
  }
}

export class NotFoundError extends BaseError {
  constructor(name = 'NOT FOUND', description = 'Not Found Error', metadata?: Record<string, unknown>) {
    super(name, description, HttpStatusCode.NOT_FOUND, metadata, true);
  }
}

export class InternalServerError extends BaseError {
  constructor(name = 'INTERNAL SERVER', description = 'Internal Server Error', metadata?: Record<string, unknown>) {
    super(name, description, HttpStatusCode.INTERNAL_SERVER, metadata, true);
  }
}
