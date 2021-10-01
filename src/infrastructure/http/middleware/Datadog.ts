import * as connectDatadog from 'connect-datadog';
import { Express } from 'express';
import {
  ClientOptions,
  StatsD,
} from 'hot-shots';

export interface DatadogStatsdConfig {
  targetHost: string;
  enableTelemetry: boolean;
  tags: string[];
}

export class DatadogStatsdMiddleware {
  public static applyTo(server: Express, config: DatadogStatsdConfig) {
    const statsdClient = DatadogStatsdMiddleware.createStatsdClient({
      host: config.targetHost,
      mock: !config.enableTelemetry
    });

    const datadogStatsdMiddleware = connectDatadog({
      dogstatsd: statsdClient,
      tags: config.tags,
      path: false,
      method: true,
      response_code: false
    });

    server.use(datadogStatsdMiddleware);
  }

  private static createStatsdClient(options?: ClientOptions) {
    const statsdClient = new StatsD(options);
    statsdClient.socket.on('error', (err: any) => {
      console.error('Error sending datadog stats', err);
    });
    return statsdClient;
  }
}
