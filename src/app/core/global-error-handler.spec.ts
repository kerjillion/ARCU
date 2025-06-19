import { GlobalErrorHandler } from './global-error-handler';
import { LoggingService } from './logging.service';
import { Injector } from '@angular/core';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let mockLoggingService: jest.Mocked<LoggingService>;
  let mockInjector: jest.Mocked<Injector>;

  beforeEach(() => {
    mockLoggingService = { error: jest.fn() } as any;
    mockInjector = { get: jest.fn().mockReturnValue(mockLoggingService) } as any;
    handler = new GlobalErrorHandler(mockInjector);
  });

  it('Scenario: should log errors using LoggingService', () => {
    const testError = new Error('Test error');
    handler.handleError(testError);
    expect(mockInjector.get).toHaveBeenCalledWith(LoggingService);
    expect(mockLoggingService.error).toHaveBeenCalledWith('Global error caught:', testError);
  });

  it('Scenario: should handle non-Error objects', () => {
    const testError = 'A string error';
    handler.handleError(testError);
    expect(mockLoggingService.error).toHaveBeenCalledWith('Global error caught:', testError);
  });
});
