import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    service = new StateService();
  });

  it('Scenario: should initialize with empty state', () => {
    expect(service.state()).toEqual({});
  });

  it('Scenario: should set and get a simple value', () => {
    service.setState('theme', 'dark');
    expect(service.getState('theme')).toBe('dark');
    expect(service.state()).toEqual({ theme: 'dark' });
  });

  it('Scenario: should handle multiple state values', () => {
    service.setState('theme', 'dark');
    service.setState('language', 'en');
    service.setState('user', { id: 1, name: 'John' });
    
    expect(service.getState('theme')).toBe('dark');
    expect(service.getState('language')).toBe('en');
    expect(service.getState('user')).toEqual({ id: 1, name: 'John' });
    expect(service.state()).toEqual({
      theme: 'dark',
      language: 'en',
      user: { id: 1, name: 'John' }
    });
  });

  it('Scenario: should update existing state values', () => {
    service.setState('count', 1);
    expect(service.getState('count')).toBe(1);
    
    service.setState('count', 2);
    expect(service.getState('count')).toBe(2);
    expect(service.state()).toEqual({ count: 2 });
  });

  it('Scenario: should return undefined for non-existent keys', () => {
    expect(service.getState('nonExistent')).toBeUndefined();
  });

  it('Scenario: should handle complex object values', () => {
    const complexObject = {
      settings: { 
        notifications: true, 
        autoSave: false 
      },
      preferences: ['dark', 'compact'],
      metadata: null
    };
    
    service.setState('config', complexObject);
    expect(service.getState('config')).toEqual(complexObject);
  });

  it('Scenario: should reset all state to empty object', () => {
    service.setState('theme', 'dark');
    service.setState('language', 'en');
    service.setState('user', { id: 1 });
    
    expect(service.state()).not.toEqual({});
    
    service.reset();
    expect(service.state()).toEqual({});
    expect(service.getState('theme')).toBeUndefined();
    expect(service.getState('language')).toBeUndefined();
    expect(service.getState('user')).toBeUndefined();
  });

  it('Scenario: should handle generic typing for getState', () => {
    interface User {
      id: number;
      name: string;
    }
    
    const user: User = { id: 1, name: 'John' };
    service.setState('currentUser', user);
    
    const retrievedUser = service.getState<User>('currentUser');
    expect(retrievedUser).toEqual(user);
    expect(retrievedUser?.id).toBe(1);
    expect(retrievedUser?.name).toBe('John');
  });

  it('Scenario: should preserve existing state when adding new values', () => {
    service.setState('a', 1);
    service.setState('b', 2);
    service.setState('c', 3);
    
    expect(service.state()).toEqual({ a: 1, b: 2, c: 3 });
    expect(service.getState('a')).toBe(1);
    expect(service.getState('b')).toBe(2);
    expect(service.getState('c')).toBe(3);
  });
});
