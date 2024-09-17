import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '@/domain/ports/authentication/authentication.port';
import { UnauthorizedUser } from '@/domain/errors/unauthorizedUser.error';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jest.Mocked<AuthenticationService>;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    authService = {
      signData: jest.fn(),
      verify: jest.fn(),
    };
    reflector = {
      get: jest.fn(),
      getAll: jest.fn(),
      getAllAndMerge: jest.fn(),
      getAllAndOverride: jest.fn(),
    };

    guard = new AuthGuard(authService, reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if route is public', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
    const ctxMock: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    const result = await guard.canActivate(ctxMock);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedUser if token is not provided', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);

    const ctxMock: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    await expect(guard.canActivate(ctxMock)).rejects.toThrow(UnauthorizedUser);
  });

  it('should set user in request if token is provided and valid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);
    const mockPayload = { userId: '123' };
    jest.spyOn(authService, 'verify').mockResolvedValueOnce(mockPayload);

    const ctxMock: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer validToken' },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    const value = await guard.canActivate(ctxMock);
    expect(value).toBeTruthy();
  });

  it('should throw UnauthorizedUser if token is provided but invalid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);
    jest.spyOn(authService, 'verify').mockRejectedValueOnce(new Error());
    const ctxMock: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalidToken' },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };

    await expect(guard.canActivate(ctxMock)).rejects.toThrow(UnauthorizedUser);
  });
});
