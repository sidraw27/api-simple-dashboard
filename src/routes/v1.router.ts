import { Routes } from '@nestjs/core';
import { UserModule } from '../app/user';

export const routes: Routes = [
  {
    path: 'users',
    module: UserModule,
  },
];
