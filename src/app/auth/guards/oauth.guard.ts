import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OauthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { provider } = context.switchToHttp().getRequest().params;

    const Guard = AuthGuard(provider);

    return new Guard(provider).canActivate(context);
  }
}
