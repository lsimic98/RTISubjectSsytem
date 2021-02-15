import { TestBed } from '@angular/core/testing';

import { SetterService } from './setter.service';

describe('SetterService', () => {
  let service: SetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
