// database.provider.ts
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DATA_SOURCE } from '../constants';

export const getDataSourceOptions = (
  database?: string,
  port?: string,
): DataSourceOptions => ({
  type: 'mysql',
  //   host: configService.get<string>('DB_HOST'),
  //   username: configService.get<string>('DB_USERNAME'),
  //   password: configService.get<string>('DB_PASSWORD'),
  //   entities: [User],
  //   database: database || configService.get<string>('DB_DATABASE'),
  //   port: parseInt(port) || configService.get<number>('DB_PORT'),
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [User],
  database: database || process.env.DB_DATABASE,
  port: parseInt(port) || parseInt(process.env.DB_PORT),
});

export const DataSourceProvider = {
  provide: DATA_SOURCE,
  useFactory: async () => {
    const options = getDataSourceOptions();
    const dataSource = new DataSource(options);
    return dataSource.initialize();
  },
};

export const getInitializedDataSource = (
  database?: string,
  port?: string,
): Promise<DataSource> => {
  console.log('database', database, 'port', port);
  const options = getDataSourceOptions(database, port);
  const dataSource = new DataSource(options as DataSourceOptions);
  return dataSource.initialize();
};
