import ErrorHandler from './errorHandler';
import { BaseError, HttpStatusCode } from './errors';
import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

const fastifyErrorHandler = (error: FastifyError | BaseError | Error, request: FastifyRequest, reply: FastifyReply) => {
  if (ErrorHandler.isFastifyError(error)) {
    ErrorHandler.handleError(error);

    return reply.status(HttpStatusCode.BAD_REQUEST).send(error.validation);
  }

  if (ErrorHandler.isTrustedError(error)) {
    const { httpCode, message } = error;

    ErrorHandler.handleError(error);

    return reply.status(httpCode).send(message);
  }

  return reply.status(500).send(error.message);
};

export default fastifyErrorHandler;
