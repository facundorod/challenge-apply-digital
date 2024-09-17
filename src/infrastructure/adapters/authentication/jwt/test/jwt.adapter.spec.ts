import { JwtService } from '@nestjs/jwt';
import { JWTService } from '../jwt.adapter';

describe('JWTService', () => {
  let jwtService: JWTService;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    jwtService = new JWTService(mockJwtService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('signData', () => {
    it('should call signAsync method of JwtService', async () => {
      const dataToSign = { email: 'test@test.com' };
      const expectedToken = 'generated.token';

      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await jwtService.signData(dataToSign);

      expect(result).toEqual(expectedToken);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(dataToSign);
    });
  });

  describe('verify', () => {
    it('should call verifyAsync method of JwtService', async () => {
      const accessToken = 'some.token';
      const expectedData = { email: 'test@test.com' };

      mockJwtService.verifyAsync.mockResolvedValue(expectedData);

      const result = await jwtService.verify(accessToken);

      expect(result).toEqual(expectedData);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(accessToken);
    });
  });
});
