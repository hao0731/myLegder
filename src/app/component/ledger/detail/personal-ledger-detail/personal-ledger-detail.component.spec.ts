import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLedgerDetailComponent } from './personal-ledger-detail.component';

describe('PersonalLedgerDetailComponent', () => {
  let component: PersonalLedgerDetailComponent;
  let fixture: ComponentFixture<PersonalLedgerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLedgerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLedgerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
