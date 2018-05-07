import { TestBed, inject } from '@angular/core/testing';

import { DealLoginStatusService } from './deal-login-status.service';

describe('DealLoginStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DealLoginStatusService]
    });
  });

  it('should be created', inject([DealLoginStatusService], (service: DealLoginStatusService) => {
    expect(service).toBeTruthy();
  }));
});
