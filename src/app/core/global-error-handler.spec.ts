import { GlobalErrorHandler } from './global-error-handler';
import { LoggingService } from './logging.service';
import { ErrorMonitoringService } from './error-monitoring.service';
import { Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let mockLoggingService: jest.Mocked<LoggingService>;
  let mockErrorMonitoringService: jest.Mocked<ErrorMonitoringService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let mockInjector: jest.Mocked<Injector>;

  beforeEach(() => {
    mockLoggingService = { error: jest.fn() } as any;
    mockErrorMonitoringService = { reportError: jest.fn() } as any;
    mockSnackBar = { 
      open: jest.fn().mockReturnValue({ onAction: jest.fn(), afterDismissed: jest.fn() })
    } as any;
    
    mockInjector = { 
      get: jest.fn().mockImplementation((token) => {
        if (token === LoggingService) return mockLoggingService;
        if (token === ErrorMonitoringService) return mockErrorMonitoringService;
        if (token === MatSnackBar) return mockSnackBar;
        return null;
      })
    } as any;
    
    handler = new GlobalErrorHandler(mockInjector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Scenario: should log errors using LoggingService', () => {
    const testError = new Error('Test error');
    handler.handleError(testError);
    
    expect(mockInjector.get).toHaveBeenCalledWith(LoggingService);
    expect(mockLoggingService.error).toHaveBeenCalledWith('Global error caught:', testError);
    expect(mockLoggingService.error).toHaveBeenCalledWith('Error Details:', expect.objectContaining({
      message: 'Test error',
      timestamp: expect.any(String),
      userAgent: expect.any(String),
      url: expect.any(String)
    }));
  });

  it('Scenario: should show user-friendly notification via MatSnackBar', () => {
    const testError = new Error('Method not implemented');
    handler.handleError(testError);
    
    expect(mockInjector.get).toHaveBeenCalledWith(MatSnackBar);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'This feature is not yet available. Please try again later.',
      'Dismiss',
      expect.objectContaining({
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })    );
  });

  it('Scenario: should report errors to monitoring service', () => {
    const testError = new Error('Test error for monitoring');
    handler.handleError(testError);
    
    expect(mockInjector.get).toHaveBeenCalledWith(ErrorMonitoringService);
    expect(mockErrorMonitoringService.reportError).toHaveBeenCalledWith(
      testError,
      expect.objectContaining({
        message: 'Test error for monitoring',
        timestamp: expect.any(String),
        userAgent: expect.any(String),
        url: expect.any(String)
      })
    );
  });

  it('Scenario: should handle non-Error objects', () => {
    const testError = 'A string error';
    handler.handleError(testError);
    
    expect(mockLoggingService.error).toHaveBeenCalledWith('Global error caught:', testError);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Something went wrong. Please refresh the page and try again.',
      'Dismiss',
      expect.any(Object)
    );
    expect(mockErrorMonitoringService.reportError).toHaveBeenCalledWith(
      testError,
      expect.any(Object)
    );
  });

  it('Scenario: should handle MatSnackBar injection errors gracefully', () => {    // Mock injector to throw error when trying to get MatSnackBar
    mockInjector.get.mockImplementation((token) => {
      if (token === LoggingService) return mockLoggingService;
      if (token === ErrorMonitoringService) return mockErrorMonitoringService;
      if (token === MatSnackBar) throw new Error('MatSnackBar not available');
      return null;
    });

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const testError = new Error('Test error');
    
    // Should not throw, should handle gracefully
    expect(() => handler.handleError(testError)).not.toThrow();
    
    expect(consoleSpy).toHaveBeenCalledWith('Could not show user notification:', expect.any(Error));
    expect(mockLoggingService.error).toHaveBeenCalled();
    expect(mockErrorMonitoringService.reportError).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('Scenario: should translate technical messages to user-friendly ones', () => {
    const testCases = [
      { input: 'Network error occurred', expected: 'Network connection issue. Please check your internet connection and try again.' },
      { input: 'Request timeout', expected: 'The request took too long. Please try again.' },
      { input: 'Unauthorized access', expected: 'You do not have permission to perform this action.' },
      { input: '404 not found', expected: 'The requested information could not be found.' },
      { input: 'Random error', expected: 'Something went wrong. Please refresh the page and try again.' }
    ];

    testCases.forEach(({ input, expected }) => {
      mockSnackBar.open.mockClear();
      handler.handleError(new Error(input));
      
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        expected,
        'Dismiss',
        expect.any(Object)
      );
    });
  });
});
