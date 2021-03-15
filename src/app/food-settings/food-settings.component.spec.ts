import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSettingsComponent } from './food-settings.component';

describe('FoodSettingsComponent', () => {
  let component: FoodSettingsComponent;
  let fixture: ComponentFixture<FoodSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
