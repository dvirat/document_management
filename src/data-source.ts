import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database.config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const AppDataSource = new DataSource(databaseConfig as MysqlConnectionOptions); 