import pino, { Logger } from "pino";
import pretty from "pino-pretty";

export class LogFactory {
  private static $instance: LogFactory;
  private readonly $logger: Logger;

  private constructor() {
    const stream = pretty({
      colorize: true,
      levelFirst: true,
      ignore: 'hostname',
      customPrettifiers: {
      }
    })

    this.$logger = pino({
      name: 'uc',
      level: process.env.LOG_LEVEL || "info"
    }, stream);
  }

  public static instance(): LogFactory {
    if (this.$instance) return this.$instance;
    this.$instance = new LogFactory();
    return this.$instance;
  }

  public logger() : Logger {
    return this.$logger;
  }

}

export const logger = LogFactory.instance().logger();
