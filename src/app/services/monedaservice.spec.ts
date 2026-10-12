import { TestBed } from '@angular/core/testing';
import { Monedaservice } from './monedaservice';

describe('Monedaservice', () => {
  let service: Monedaservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Monedaservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
