import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFoodDialogComponent } from './add-new-food-dialog.component';

describe('AddNewFoodDialogComponent', () => {
  let component: AddNewFoodDialogComponent;
  let fixture: ComponentFixture<AddNewFoodDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewFoodDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewFoodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
