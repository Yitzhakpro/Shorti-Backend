import winston from 'winston';
import config from '../config';
import type { Enviroment } from '../types';

const loggerConfig = config.get('logger');
const env = config.get('env') as Enviroment;

class Logger {
  private logger: winston.Logger;

  constructor(filename: string) {
    const { filepath, maxFiles, maxsize } = loggerConfig;

    const transportsByEnv: Record<Enviroment, winston.transport[]> = {
      production: [
        new winston.transports.File({
          filename: `${filepath}\\${filename}`,
          maxFiles,
          maxsize,
        }),
      ],
      development: [
        new winston.transports.File({
          filename: `${filepath}\\${filename}`,
          maxFiles,
          maxsize,
        }),
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
      test: [],
    };

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: transportsByEnv[env],
    });
  }

  public async info(name: string, message: string, metadata?: Record<string, unknown>) {
    this.logger.info(message, { name, ...metadata });
  }

  public async warn(name: string, message: string, metadata?: Record<string, unknown>) {
    this.logger.warn(message, { name, ...metadata });
  }

  public async error(name: string, message: string, metadata?: Record<string, unknown>) {
    this.logger.error(message, { name, ...metadata });
  }
}

const logger = new Logger('api_logs.json');

export { logger };
