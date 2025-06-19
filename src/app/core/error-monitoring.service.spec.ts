import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorMonitoringService, ErrorMonitoringConfig, ErrorData } from './error-monitoring.service';

describe('ErrorMonitoringService', () => {
  let service: ErrorMonitoringService;
  let httpMock: HttpTestingController;
  let mockConfig: ErrorMonitoringConfig;
  let consoleSpy: jest.SpyInstance;
  let localStorageSpy: jest.SpyInstance;
  let sessionStorageSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock localStorage and sessionStorage
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    localStorageSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(mockStorage.getItem);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(mockStorage.setItem);
    
    sessionStorageSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(mockStorage.getItem);

    // Mock console methods
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost:4200/test' },
      writable: true
    });

    // Mock navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Test User Agent',
      writable: true
    });

    mockConfig = {
      enableRemoteLogging: true,
      enableConsoleLogging: true,
      maxRetries: 2,
      batchSize: 5,
      flushInterval: 1000,
      customApiEndpoint: 'http://test-api.com/errors'
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ErrorMonitoringService,
        { provide: 'ERROR_MONITORING_CONFIG', useValue: mockConfig }
      ]
    });

    service = TestBed.inject(ErrorMonitoringService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default config when no config provided', () => {
      const serviceWithoutConfig = new ErrorMonitoringService(
        TestBed.inject(HttpClientTestingModule) as any,
        undefined
      );
      expect(serviceWithoutConfig).toBeTruthy();
    });    it('should log initialization message', () => {
      // This test checks that the service logs on initialization which happens in beforeEach
      expect(consoleSpy).toHaveBeenCalledWith('Error monitoring initialized');
    });
  });
  describe('Error Reporting', () => {
    it('should report a simple error', () => {
      const testError = new Error('Test error message');
      
      // Clear previous console calls from service initialization
      jest.clearAllMocks();
      
      service.reportError(testError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Test error message',
          errorType: 'Error',
          severity: 'critical'
        })
      );
    });    it('should report error with context', () => {
      const testError = new Error('Test error');
      const context = { userId: '123', action: 'button-click' };
      
      // Clear previous console calls
      jest.clearAllMocks();
      
      service.reportError(testError, context);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Test error',
          context: context
        })
      );
    });    it('should handle string errors', () => {
      // Clear previous console calls
      jest.clearAllMocks();
      
      service.reportError('String error message');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'String error message',
          errorType: 'Unknown'
        })
      );
    });    it('should classify network errors correctly', () => {
      const networkError = new Error('Network timeout occurred');
      
      // Clear previous console calls
      jest.clearAllMocks();
      
      service.reportError(networkError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Network timeout occurred',
          severity: 'warning'
        })
      );
    });    it('should classify unauthorized errors correctly', () => {
      const authError = new Error('Unauthorized access');
      
      // Clear previous console calls
      jest.clearAllMocks();
      
      service.reportError(authError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Unauthorized access',
          severity: 'error'
        })
      );
    });    it('should classify not found errors correctly', () => {
      const notFoundError = new Error('Resource not found');
      
      // Clear previous console calls
      jest.clearAllMocks();
      
      service.reportError(notFoundError);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Resource not found',
          severity: 'info'
        })
      );
    });
  });

  describe('User Context Management', () => {
    it('should set user context', () => {
      const userId = 'user123';
      const userInfo = { name: 'John Doe', email: 'john@example.com' };
      
      service.setUserContext(userId, userInfo);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('errorMonitoring_userId', userId);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'errorMonitoring_userInfo', 
        JSON.stringify(userInfo)
      );
    });

    it('should set user context without additional info', () => {
      const userId = 'user456';
      
      service.setUserContext(userId);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('errorMonitoring_userId', userId);
      expect(localStorage.setItem).not.toHaveBeenCalledWith(
        'errorMonitoring_userInfo', 
        expect.anything()
      );
    });
  });

  describe('Tags Management', () => {
    it('should set tags', () => {
      const tags = { environment: 'test', feature: 'assessment' };
      
      service.setTags(tags);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'errorMonitoring_tags', 
        JSON.stringify(tags)
      );
    });
  });
  describe('Remote API Integration', () => {
    it('should send error to custom API when configured', () => {
      const testError = new Error('API test error');
      
      // Clear previous console calls and HTTP expectations
      jest.clearAllMocks();
      
      // Report a critical error to trigger immediate sending
      service.reportError(testError);
      
      // Expect HTTP request to custom API
      const req = httpMock.expectOne(mockConfig.customApiEndpoint!);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(
        expect.objectContaining({
          message: 'API test error',
          errorType: 'Error',
          severity: 'critical'
        })
      );
      
      req.flush({ success: true });
    });

    it('should handle API errors gracefully', () => {
      const testError = new Error('API error test');
      
      // Clear previous console calls
      jest.clearAllMocks();
      const warnSpy = jest.spyOn(console, 'warn');
      
      service.reportError(testError);
      
      const req = httpMock.expectOne(mockConfig.customApiEndpoint!);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      
      expect(warnSpy).toHaveBeenCalledWith(
        'Failed to send error to custom API:', 
        expect.any(Object)
      );
    });
  });
  describe('Error Data Structure', () => {
    it('should create complete error data structure', () => {
      const testError = new Error('Complete test error');
      testError.stack = 'Error stack trace';
      const context = { component: 'TestComponent' };
      
      // Mock localStorage to return user data
      localStorageSpy.mockImplementation((key: string) => {
        switch (key) {
          case 'errorMonitoring_userId': return 'test-user';
          case 'errorMonitoring_tags': return JSON.stringify({ env: 'test' });
          default: return null;
        }
      });
      
      // Clear previous console calls
      jest.clearAllMocks();
      
      service.reportError(testError, context);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Complete test error',
          stack: 'Error stack trace',
          timestamp: expect.any(String),
          url: 'http://localhost:4200/test',
          userAgent: 'Test User Agent',
          userId: 'test-user',
          sessionId: expect.any(String),
          buildVersion: expect.any(String),
          errorType: 'Error',
          severity: 'critical',
          context: context,
          tags: { env: 'test' },
          fingerprint: expect.any(String)
        })
      );
    });    it('should generate consistent fingerprints for similar errors', () => {
      const error1 = new Error('Same error message');
      const error2 = new Error('Same error message');
      
      let fingerprint1: string | undefined;
      let fingerprint2: string | undefined;
      
      // Clear previous console calls
      jest.clearAllMocks();
      
      const originalConsoleLog = console.log;
      console.log = jest.fn((message, errorData) => {
        if (message === 'Error reported:') {
          if (!fingerprint1) {
            fingerprint1 = errorData.fingerprint;
          } else {
            fingerprint2 = errorData.fingerprint;
          }
        }
      });
      
      service.reportError(error1);
      service.reportError(error2);
      
      expect(fingerprint1).toBeDefined();
      expect(fingerprint2).toBeDefined();
      expect(fingerprint1).toBe(fingerprint2);
      console.log = originalConsoleLog;
    });
  });

  describe('Configuration Options', () => {
    it('should respect enableConsoleLogging=false', () => {
      const serviceWithNoLogging = new (ErrorMonitoringService as any)(
        TestBed.inject(HttpClientTestingModule),
        { ...mockConfig, enableConsoleLogging: false }
      );
      
      const logSpy = jest.spyOn(console, 'log');
      serviceWithNoLogging.reportError(new Error('Test error'));
      
      expect(logSpy).not.toHaveBeenCalledWith(
        'Error reported:', 
        expect.any(Object)
      );
    });

    it('should respect enableRemoteLogging=false', () => {
      const serviceWithNoRemote = new (ErrorMonitoringService as any)(
        TestBed.inject(HttpClientTestingModule),
        { ...mockConfig, enableRemoteLogging: false }
      );
      
      serviceWithNoRemote.reportError(new Error('Test error'));
      
      httpMock.expectNone(mockConfig.customApiEndpoint!);
    });
  });

  describe('Service Cleanup', () => {
    it('should cleanup resources on destroy', () => {
      // Setup some timers by reporting errors
      service.reportError(new Error('Test error 1'));
      service.reportError(new Error('Test error 2'));
      
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      
      service.destroy();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors in error processing gracefully', () => {
      // Mock localStorage to throw an error
      localStorageSpy.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const warnSpy = jest.spyOn(console, 'warn');
      
      // This should not throw, but should warn
      expect(() => {
        service.setUserContext('test-user');
      }).not.toThrow();
      
      expect(warnSpy).toHaveBeenCalledWith(
        'Failed to set user context:', 
        expect.any(Error)
      );
    });

    it('should handle malformed error objects', () => {
      const malformedError = { weird: 'object', nested: { error: { message: 'Deep message' } } };
      
      expect(() => {
        service.reportError(malformedError);
      }).not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Deep message',
          errorType: 'Unknown'
        })
      );
    });

    it('should handle null and undefined errors', () => {
      expect(() => {
        service.reportError(null);
      }).not.toThrow();
      
      expect(() => {
        service.reportError(undefined);
      }).not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reported:', 
        expect.objectContaining({
          message: 'Unknown error occurred'
        })
      );
    });
  });
});