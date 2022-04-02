import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { routes as v1Routes } from './routes/v1.router';

const routes: Routes = [
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
  imports: [RouterModule.register(routes), ...v1Modules],
})
export class AppModule {}
