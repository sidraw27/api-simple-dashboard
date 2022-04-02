import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import ormOptions from './config/orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormOptions)],
})
export class OrmModule {}
