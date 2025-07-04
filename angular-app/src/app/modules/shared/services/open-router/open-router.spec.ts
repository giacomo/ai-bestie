import { TestBed } from '@angular/core/testing';

import { OpenRouter } from './open-router';

describe('OpenRouter', () => {
  let service: OpenRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenRouter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
