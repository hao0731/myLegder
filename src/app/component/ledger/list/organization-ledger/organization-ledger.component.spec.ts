import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLedgerComponent } from './organization-ledger.component';

describe('OrganizationLedgerComponent', () => {
  let component: OrganizationLedgerComponent;
  let fixture: ComponentFixture<OrganizationLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationLedgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
