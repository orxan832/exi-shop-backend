import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'announcement',
  entities: [process.cwd() + '/dist/entities/*.entity{.ts,.js}'],
  synchronize: true,
  // logging: true
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
