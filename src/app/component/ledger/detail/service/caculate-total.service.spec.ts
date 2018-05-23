import { TestBed, inject } from '@angular/core/testing';

import { CaculateTotalService } from './caculate-total.service';

describe('CaculateTotalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaculateTotalService]
    });
  });

  it('should be created', inject([CaculateTotalService], (service: CaculateTotalService) => {
    expect(service).toBeTruthy();
  }));
});
