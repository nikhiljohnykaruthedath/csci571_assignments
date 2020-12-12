import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyDetailsDialogComponent } from './buy-details-dialog.component';

describe('BuyDetailsDialogComponent', () => {
  let component: BuyDetailsDialogComponent;
  let fixture: ComponentFixture<BuyDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
