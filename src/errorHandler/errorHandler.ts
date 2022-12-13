import { BaseError } from './errors';
import type { FastifyError } from 'fastify';

class ErrorHandler {
  public async handleError(error: Error): Promise<void> {
    console.error(error);
  }

  public isFastifyError(error: FastifyError | BaseError | Error): error is FastifyError {
    return (error as FastifyError).validation !== undefined;
  }

  public isTrustedError(error: Error): error is BaseError {
    if (error instanceof BaseError) {
      return error.isOpeational;
    }

    return false;
  }
}

export default new ErrorHandler();
