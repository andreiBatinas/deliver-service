import * as Bunyan from 'bunyan';

type MessageType<T> = T;

export class Logger {
  private handler: Bunyan;

  constructor(name: string) {
    this.handler = Bunyan.createLogger({
      name,
      level: Bunyan.TRACE,
      serializers: {
        err: Bunyan.stdSerializers.err // <--- use this
      }
    });
  }

  public info(message: MessageType<Error | object | string>, ...params: any[]) {
    this.handler.info(message, ...params);
  }

  public error(
    message: MessageType<Error | object | string>,
    ...params: any[]
  ) {
    this.handler.error(message, ...params);
  }

  public warn(message: MessageType<Error | object | string>, ...params: any[]) {
    this.handler.warn(message, ...params);
  }

  public debug(
    message: MessageType<Error | object | string>,
    ...params: any[]
  ) {
    this.handler.debug(message, ...params);
  }
}
