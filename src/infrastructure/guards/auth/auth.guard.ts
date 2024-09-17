import { UnauthorizedUser } from '@/domain/errors/unauthorizedUser.error';
import { AuthenticationService } from '@/domain/ports/authentication/authentication.port';
import { IS_PUBLIC_KEY } from '@/infrastructure/configuration/decorators/public.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    if (!token) {
      throw new UnauthorizedUser();
    }

    try {
      const payload: any = await this.authenticationService.verify(token);
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedUser();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
