import { EnvironmentService } from '@/domain/ports/configuration/environment.port';
import { BCryptService } from '../bcrypt.adapter';

describe('BCryptAdapter', () => {
  let bcryptService: BCryptService;
  let configService: jest.Mocked<EnvironmentService>;

  beforeEach(async () => {
    configService = {
      getEncryptationSaltValue: jest.fn().mockReturnValue(10),
    } as unknown as jest.Mocked<EnvironmentService>;
    bcryptService = new BCryptService(configService);
  });

  it('should encrypt data', async () => {
    const encryptedData = await bcryptService.encryptData('testData');
    expect(encryptedData).toBeDefined();
    expect(typeof encryptedData).toBe('string');
  });

  it('should compare data correctly', async () => {
    const compareMock = jest.fn().mockResolvedValue(true);
    bcryptService.compare = compareMock;

    const result = await bcryptService.compare('testData', 'encryptedData');
    expect(result).toBeTruthy();
    expect(compareMock).toHaveBeenCalledWith('testData', 'encryptedData');
  });
});
