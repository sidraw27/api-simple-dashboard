import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { routes as v1Routes } from './routes/v1.router';
import { OrmModule } from './orm.module';

const routers: Routes = [
  {
    path: 'api',
    children: [
      {
        path: 'v1',
        children: v1Routes,
      },
    ],
  },
];

const v1Modules = v1Routes.map((route) => route.module);

@Module({
  imports: [
    ConfigModule.forRoot(),
    RouterModule.register(routers),
    ...v1Modules,
    OrmModule,
  ],
})
export class AppModule {}
