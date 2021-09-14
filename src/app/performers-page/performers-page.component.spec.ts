import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformersPageComponent } from './performers-page.component';

xdescribe('PerformersPageComponent', () => {
  let component: PerformersPageComponent;
  let fixture: ComponentFixture<PerformersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerformersPageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
