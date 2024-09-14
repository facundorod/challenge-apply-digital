import { WinstonAdapter } from './winston.adapter';
import * as winston from 'winston';

jest.mock('winston', () => ({
  createLogger: jest.fn(),
  format: {
    combine: jest.fn(() => 'mocked combine'),
    timestamp: jest.fn(() => 'mocked timestamp'),
    json: jest.fn(() => 'mocked json'),
    colorize: jest.fn(() => 'mocked colorize'),
  },
  transports: {
    Console: jest.fn(),
  },
}));

describe('WinstonAdapter', () => {
  let winstonAdapter: WinstonAdapter;

  const mockWinstonLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(() => {
    (winston.createLogger as jest.Mock).mockReturnValue(mockWinstonLogger);

    winstonAdapter = new WinstonAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log information using info level', () => {
    const message = 'Test info message';
    const optionalParams = ['param1', 'param2'];

    winstonAdapter.log(message, ...optionalParams);

    expect(mockWinstonLogger.info).toHaveBeenCalledWith(
      message,
      optionalParams,
    );
  });

  it('should log a warning using warn level', () => {
    const message = 'Test warning message';
    const optionalParams = ['param1', 'param2'];

    winstonAdapter.warn(message, ...optionalParams);

    expect(mockWinstonLogger.warn).toHaveBeenCalledWith(
      message,
      optionalParams,
    );
  });

  it('should log an error using error level', () => {
    const message = 'Test error message';
    const optionalParams = ['param1', 'param2'];

    winstonAdapter.error(message, ...optionalParams);

    expect(mockWinstonLogger.error).toHaveBeenCalledWith(
      message,
      optionalParams,
    );
  });

  it('should log debug information using debug level', () => {
    const message = 'Test debug message';
    const optionalParams = ['param1', 'param2'];

    winstonAdapter.debug(message, ...optionalParams);

    expect(mockWinstonLogger.debug).toHaveBeenCalledWith(
      message,
      optionalParams,
    );
  });

  it('should log verbose information using verbose level', () => {
    const message = 'Test verbose message';
    const optionalParams = ['param1', 'param2'];

    winstonAdapter.verbose(message, ...optionalParams);

    expect(mockWinstonLogger.verbose).toHaveBeenCalledWith(
      message,
      optionalParams,
    );
  });
});
