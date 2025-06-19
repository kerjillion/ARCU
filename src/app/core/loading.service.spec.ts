import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('Scenario: should initialize with loading$ as false', () => {
    expect(service.loading$()).toBe(false);
  });

  it('Scenario: should set loading$ to true when show() is called', () => {
    service.show();
    expect(service.loading$()).toBe(true);
  });

  it('Scenario: should set loading$ to false when hide() is called after show()', () => {
    service.show();
    expect(service.loading$()).toBe(true);
    service.hide();
    expect(service.loading$()).toBe(false);
  });

  it('Scenario: should handle multiple show() calls and require equal hide() calls', () => {
    service.show();
    service.show();
    service.show();
    expect(service.loading$()).toBe(true);
    
    service.hide();
    expect(service.loading$()).toBe(true); // Still loading
    
    service.hide();
    expect(service.loading$()).toBe(true); // Still loading
    
    service.hide();
    expect(service.loading$()).toBe(false); // Now not loading
  });

  it('Scenario: should not go below zero when hide() is called more than show()', () => {
    service.hide();
    service.hide();
    expect(service.loading$()).toBe(false);
    
    service.show();
    expect(service.loading$()).toBe(true);
    
    service.hide();
    expect(service.loading$()).toBe(false);
  });

  it('Scenario: should handle concurrent operations correctly', () => {
    // Simulate multiple concurrent requests
    service.show(); // Request 1 starts
    service.show(); // Request 2 starts
    expect(service.loading$()).toBe(true);
    
    service.hide(); // Request 1 ends
    expect(service.loading$()).toBe(true); // Still loading (Request 2)
    
    service.show(); // Request 3 starts
    expect(service.loading$()).toBe(true);
    
    service.hide(); // Request 2 ends
    expect(service.loading$()).toBe(true); // Still loading (Request 3)
    
    service.hide(); // Request 3 ends
    expect(service.loading$()).toBe(false); // All done
  });
});
