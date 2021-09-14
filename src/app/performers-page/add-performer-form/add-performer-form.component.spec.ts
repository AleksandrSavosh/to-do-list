import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPerformerFormComponent } from './add-performer-form.component';
import { BackendService } from '../../backend.service';
import { clickOnButton, expectedPerformers, getElement, hasElement, inputValue } from '../../../test-utils';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import SpyObj = jasmine.SpyObj;

describe('AddPerformerFormComponent', () => {
  let component: AddPerformerFormComponent;
  let fixture: ComponentFixture<AddPerformerFormComponent>;
  let backendSpy: SpyObj<BackendService>;

  beforeEach(async () => {
    backendSpy = jasmine.createSpyObj(BackendService, ['addPerformer', 'loadPerformers']);
    backendSpy.addPerformer.and.returnValue(of(expectedPerformers[2]));
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddPerformerFormComponent],
      providers: [{ provide: BackendService, useValue: backendSpy }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPerformerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show errors', () => {
    expect(hasElement(fixture, '[data-error-firstname]')).toBeFalsy();
    expect(hasElement(fixture, '[data-error-lastname]')).toBeFalsy();
  });

  it('should show errors', () => {
    clickOnButton(fixture, '[data-submit]');

    fixture.detectChanges();

    expect(getElement(fixture, '[data-error-firstname]')).toBeTruthy();
    expect(getElement(fixture, '[data-error-lastname]')).toBeTruthy();
  });

  it('should add performer', async () => {
    expect(hasElement(fixture, '[data-success]')).toBeFalsy();

    const firstLastNames = expectedPerformers[2].name.split(' ');
    inputValue(fixture, '#firstname', firstLastNames[0]);
    inputValue(fixture, '#lastname', firstLastNames[1]);
    clickOnButton(fixture, '[data-submit]');

    fixture.detectChanges();

    expect(hasElement(fixture, '[data-error-firstname]')).toBeFalsy();
    expect(hasElement(fixture, '[data-error-lastname]')).toBeFalsy();
    expect(getElement(fixture, '[data-success]')).toBeTruthy();

    expect(backendSpy.addPerformer).toHaveBeenCalledOnceWith({ name: expectedPerformers[2].name });
    expect(backendSpy.loadPerformers).toHaveBeenCalledOnceWith();

    inputValue(fixture, '#firstname', firstLastNames[0]);
    fixture.detectChanges();

    expect(hasElement(fixture, '[data-success]')).toBeFalsy();
  });
});
