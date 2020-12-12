import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellDialogclearComponent } from './sell-dialogclear.component';

describe('SellDialogclearComponent', () => {
  let component: SellDialogclearComponent;
  let fixture: ComponentFixture<SellDialogclearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellDialogclearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellDialogclearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
