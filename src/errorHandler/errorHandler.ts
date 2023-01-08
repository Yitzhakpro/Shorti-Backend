import { logger } from '../logger';
import { BaseError } from './errors';
import type { ErrorClientInfo } from './types';
import type { FastifyError } from 'fastify';

class ErrorHandler {
  public async handleError(error: FastifyError | BaseError): Promise<void> {
    const { name, message } = error;
    logger.error(name, message, { ...error });
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
      const { statusCode, errorCode, metadata } = error;
      const { error: _, ...restOfMetadata } = metadata;

      return {
        statusCode,
        message: errorCode,
        metadata: restOfMetadata,
      };
    }

    return {
      statusCode: 500,
      message: 'INTERNAL_SERVER_ERROR',
      metadata: {},
    };
  }
}

export default new ErrorHandler();
