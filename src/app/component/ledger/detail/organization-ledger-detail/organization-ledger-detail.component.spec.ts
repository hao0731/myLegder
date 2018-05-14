import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationLedgerDetailComponent } from './organization-ledger-detail.component';

describe('OrganizationLedgerDetailComponent', () => {
  let component: OrganizationLedgerDetailComponent;
  let fixture: ComponentFixture<OrganizationLedgerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationLedgerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationLedgerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
