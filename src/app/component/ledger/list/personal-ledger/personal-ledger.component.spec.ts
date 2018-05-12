import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLedgerComponent } from './personal-ledger.component';

describe('PersonalLedgerComponent', () => {
  let component: PersonalLedgerComponent;
  let fixture: ComponentFixture<PersonalLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
