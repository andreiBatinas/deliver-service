import {
  Server,
  ServerCredentials,
} from 'grpc';

import { Logger } from '../logger';
import { services } from './services/services';

type GrpcService<T> = T;

export class GrpcServer {
  private server!: Server;

  private log: Logger;
  private services: GrpcService<any>[];

  constructor(log: Logger) {
    this.log = log;
    this.services = services;
  }

  public build() {
    this.server = new Server();

    this.setupSecurity();
    this.setupStandards();
    this.setupTelemetry();

    this.addServices();
  }

  public async start() {
    this.server.bind('localhost:21000', ServerCredentials.createInsecure());
    this.server.start();
  }

  private setupSecurity() {}
  private setupStandards() {}
  private setupTelemetry() {}

  private addServices() {
    for (const service of this.services) {
      this.log.info(`[GrpcServer][addServices] Adding`, service.implementation);
      this.server.addService(service.service, service.implementation);
    }
  }
}
