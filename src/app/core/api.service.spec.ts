import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

interface TestData {
  id: number;
  name: string;
}

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Scenario: loading is true during GET and false after completion', () => {
    expect(service.loading()).toBe(false);
    service.get<TestData>('/test').subscribe(data => {
      expect(data).toEqual({ id: 1, name: 'Test' });
    });
    expect(service.loading()).toBe(true);
    const req = httpMock.expectOne('/test');
    req.flush({ id: 1, name: 'Test' });
    expect(service.loading()).toBe(false);
  });

  it('Scenario: loading is true during POST and false after completion', () => {
    expect(service.loading()).toBe(false);
    service.post<TestData>('/test', { foo: 'bar' }).subscribe(data => {
      expect(data).toEqual({ id: 2, name: 'Posted' });
    });
    expect(service.loading()).toBe(true);
    const req = httpMock.expectOne('/test');
    req.flush({ id: 2, name: 'Posted' });
    expect(service.loading()).toBe(false);
  });
});
