import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfigOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'timesheeter',
  entities: [__dirname + '/../**/*.entitiy.{js,ts}'],
  synchronize: true,
};
