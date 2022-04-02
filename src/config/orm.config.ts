import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const ormOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  synchronize: false,
  cli: {
    entitiesDir: 'src/app/entities',
    migrationsDir: 'src/database/migrations',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export default ormOptions;
