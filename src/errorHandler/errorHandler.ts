import { BaseError } from './errors';
import type { ErrorClientInfo } from './types';
import type { FastifyError } from 'fastify';
class ErrorHandler {
  public async handleError(error: Error): Promise<void> {
    console.error(error);
  }

  public isFastifyValidationError(error: FastifyError | BaseError | Error): error is FastifyError {
    return (error as FastifyError).validation !== undefined;
  }

  public isTrustedError(error: Error): error is BaseError {
    if (error instanceof BaseError) {
      return error.isOpeational;
    }

    return false;
  }

  public getErrorClientInfo(error: FastifyError | BaseError | Error): ErrorClientInfo {
    if (this.isFastifyValidationError(error)) {
      const { message, validation } = error;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const params = validation!.map((validationResult) => {
        return validationResult.params;
      });

      return {
        statusCode: 500,
        message,
        metadata: { params },
      };
    }

    if (this.isTrustedError(error)) {
      const { httpCode, message, metadata } = error;

      return {
        statusCode: httpCode,
        message,
        metadata,
      };
    }

    return {
      statusCode: 500,
      message: error.message,
      metadata: {},
    };
  }
}

export default new ErrorHandler();
