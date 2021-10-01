import { Configuration } from '../../config/Config';
import { Logger } from '../logger';
import { ExpressServer } from './ExpressServer';
import { r } from './router';

// eslint-disable-next-line no-shadow
enum ProcessClose {
  UncaughtException = 'uncaughtException',
  UnhandledRejection = 'unhandledRejection',
  SignalInterrupt = 'SIGINT',
  SignalTerminate = 'SIGTERM',
  Exit = 'exit'
}

export class Application {
  private app: ExpressServer;
  private log: Logger;

  constructor(log: Logger) {
    this.log = log;
    this.app = new ExpressServer(r, log);
  }

  public async start() {
    this.app.build();
    this.handleExit();
    await this.app.start(Configuration.http.port);
  }

  private handleExit(): void {
    process.on(ProcessClose.UncaughtException, (err: Error) => {
      this.log.error(
        `[Application][handleExit] Process error ${ProcessClose.UncaughtException}`,
        err
      );
      this.shutdownGracefully(1);
    });

    process.on(
      ProcessClose.UnhandledRejection,
      // eslint-disable-next-line @typescript-eslint/ban-types
      (reason: {} | null | undefined) => {
        this.log.error(
          `[Application][handleExit] Process error ${ProcessClose.UnhandledRejection}`,
          reason
        );
        this.shutdownGracefully(2);
      }
    );

    process.on(ProcessClose.SignalInterrupt, () => {
      this.log.info(
        `[Application][handleExit] Process exit ${ProcessClose.SignalInterrupt}`
      );
      this.shutdownGracefully(128 + 2);
    });

    process.on(ProcessClose.SignalTerminate, () => {
      this.log.info(
        `[Application][handleExit] Process exit ${ProcessClose.SignalTerminate}`
      );
      this.shutdownGracefully(128 + 2);
    });

    process.on(ProcessClose.Exit, () => {
      this.log.info(
        `[Application][handleExit] Process exit ${ProcessClose.Exit}`
      );
    });
  }

  private shutdownGracefully(code: number): void {
    try {
      this.app.kill();
      process.exit(code);
    } catch (e) {
      this.log.error(
        `[Application][shutdownGracefully] Error during shut down`,
        e
      );
      process.exit(1);
    }
  }
}
