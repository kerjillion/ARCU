import { AssessmentStateService, AssessmentSummary } from './assessment-state.service';

describe('AssessmentStateService', () => {
  let service: AssessmentStateService;

  beforeEach(() => {
    service = new AssessmentStateService();
  });

  it('Scenario: should initialize signals with default values', () => {
    expect(service.id()).toBeNull();
    expect(service.name()).toBe('');
    expect(service.status()).toBe('');
  });

  it('Scenario: should set assessment state from summary', () => {
    const summary: AssessmentSummary = { id: '123', name: 'Test Assessment', status: 'Active' };
    service.setAssessment(summary);
    expect(service.id()).toBe('123');
    expect(service.name()).toBe('Test Assessment');
    expect(service.status()).toBe('Active');
  });

  it('Scenario: should clear assessment state', () => {
    const summary: AssessmentSummary = { id: '456', name: 'Another', status: 'Inactive' };
    service.setAssessment(summary);
    service.clear();
    expect(service.id()).toBeNull();
    expect(service.name()).toBe('');
    expect(service.status()).toBe('');
  });
});
