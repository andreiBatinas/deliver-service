import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  Express,
  Request,
  Response,
  Router
} from 'express';
import expressRateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { Server } from 'http';
import nocache from 'nocache';
import { Logger } from '../logger';
import {
  badRequestMiddleware,
  internalErrorMiddleware,
  notFoundMiddleware
} from './middleware/HttpValidate';

export class ExpressServer {
  private server!: Express;
  private http?: Server;

  private router: Router;
  private log: Logger;

  constructor(router: Router, log: Logger) {
    this.router = router;
    this.log = log;
  }

  public build() {
    this.server = express();

    this.setupSecurity();
    this.setupStandards();
    this.setupTelemetry();

    this.server.use(this.router);

    // Catch 404 and 500 errors.
    // This should always be last
    this.setupSafety();
  }

  public kill() {
    this.http?.close();
  }

  public async start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http = this.server?.listen(port, () => {
        this.log.info(`[ExpressServer][start] Listening on ${port}`);
        resolve();
      });
    });
  }

  private setupStandards() {
    this.server.use(bodyParser.json());
    this.server.use(cookieParser());
    this.server.use(compression());

    const apiRateLimit = {
      windowMs: 10 * 60 * 1000, // 10 min in ms
      max: 1000,
      message: JSON.stringify({
        statusCode: 429,
        message: 'API rate-limiter reached'
      }),
      onLimitReached: (req: Request, res: Response, options: any) => {
        // TODO: Add data from token later on
        this.log.warn(
          `[ExpressServer][setupStandards] Rate limit exceed ${req.ip}`
        );
      }
    };

    this.server.use('/', expressRateLimit(apiRateLimit));
  }

  private setupSecurity() {
    this.server.use(hpp());
    this.server.use(helmet());
    this.server.use(helmet.hidePoweredBy());
    this.server.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    this.server.use(nocache());
    this.server.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'unsafe-inline'"],
          scriptSrc: ["'unsafe-inline'", "'self'"]
        }
      })
    );
    this.server.use(
      cors({
        origin: 'http://example.com'
      })
    );
  }

  private setupTelemetry() {
    // TODO: Add Datadog middleware here
  }

  private setupSafety() {
    this.server.use(badRequestMiddleware);
    this.server.use(notFoundMiddleware);
    this.server.use(internalErrorMiddleware);
  }
}
