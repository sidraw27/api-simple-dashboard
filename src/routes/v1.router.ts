import { Routes } from '@nestjs/core';
import { UserModule } from '../app/user';
import { AuthModule } from '../app/auth/auth.module';

export const routes: Routes = [
  {
    path: 'users',
    module: UserModule,
  },
  {
    path: 'auth',
    module: AuthModule,
  },
];
