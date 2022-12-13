import ErrorHandler from './errorHandler';
import { BaseError } from './errors';
import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

const fastifyErrorHandler = (error: FastifyError | BaseError | Error, request: FastifyRequest, reply: FastifyReply) => {
  const { statusCode, message, metadata } = ErrorHandler.getErrorClientInfo(error);

  if (ErrorHandler.isFastifyValidationError(error) || ErrorHandler.isTrustedError(error)) {
    ErrorHandler.handleError(error);

    return reply.status(statusCode).send({ message, metadata });
  }

  return reply.status(statusCode).send({ message, metadata });
};

export default fastifyErrorHandler;
