import { Injectable, Logger } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { DbLogger } from "./db/entities/logger.entity";
import { extractServicePort } from "./utils/extract-service-port.util";

@Injectable()
export class AppService {
  private logger: Logger;
  constructor(@InjectEntityManager() private entityManager: EntityManager) {
    this.logger = new Logger(AppService.name);
  }

  async setNewConnection() {
    this.logger.log("New connection established");
    const port = await extractServicePort("logger-port");
    this.logger.log(port);
    const connection = await this.entityManager.getRepository(DbLogger).save({
      date: new Date(),
      port,
    });
    console.log(`Creado en el Logger: ${port}`);
    console.log(connection);
    return connection;
  }

  async createConnections() {
    this.logger.log("New connections established");
    const port = await extractServicePort("logger-port");
    this.logger.log(port);
    const connections = []

    for(let i = 0; i < 1000; i++){
      let connection = await this.setNewConnection();
      connections.push(connection);
    }
    return connections;
  }

  async getUsers() {
    this.logger.log("Getting connections");
    let connections = await this.entityManager.getRepository(DbLogger).find();
    console.log("Conexiones Realizadas:");
    console.log(connections);
    return connections;
  }

  async getStatistics() {
    this.logger.log("Getting Statistics");
    const records = await this.entityManager.getRepository(DbLogger).find();
    const ports = [3001, 3002, 3003, 3004, 3005]
    const statistics = []

    if (!records || records.length === 0) {
      this.logger.warn('No records found in the database');
      return [];
    }

    for (let i = 0; i < ports.length; i++){
      statistics.push({
        port: ports[i],
        connections: records.filter(r => r.port === ports[i]).length
      })
    }
    console.log("Estadisticas:")
    console.log(statistics);
    return statistics;
  }
}
