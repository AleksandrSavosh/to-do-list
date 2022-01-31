import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformersListComponent } from './performers-list.component';
import { BackendService } from '../../backend.service';
import { clickOnButton, expectedPerformers, expectedTasks, getButton, getText, getTexts } from '../../../test-utils';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('PerformersListComponent', () => {
  let component: PerformersListComponent;
  let fixture: ComponentFixture<PerformersListComponent>;
  let backendSpy: SpyObj<BackendService>;

  beforeEach(async () => {
    backendSpy = jasmine.createSpyObj(BackendService, [
      'loadTasks', 'loadPerformers', 'getTasks', 'getPerformers', 'deletePerformer'
    ]);
    backendSpy.getPerformers.and.returnValue(of(expectedPerformers));
    backendSpy.getTasks.and.returnValue(of(expectedTasks));
    backendSpy.deletePerformer.and.returnValue(of(undefined));
    await TestBed.configureTestingModule({
      declarations: [PerformersListComponent],
      providers: [
        { provide: BackendService, useValue: backendSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show performers', () => {
    expect(getTexts(fixture, '.app-performer__name')).toEqual(expectedPerformers.map(value => value.name));
  });

  it('should show number of tasks', () => {
    expect(getText(fixture, '.app-list__item:nth-child(1) .app-performer__task')).toBe('1 задача');
    expect(getText(fixture, '.app-list__item:nth-child(2) .app-performer__task')).toBe('3 задачи');
    expect(getText(fixture, '.app-list__item:nth-child(3) .app-performer__task')).toBe('Нет задач');
  });

  it('should show remove button for performer without tasks', () => {
    expect(getButton(fixture, '.app-list__item:nth-child(3) .app-performer__remove')).toBeTruthy();
  });

  it('should remove performer', () => {
    clickOnButton(fixture, '.app-list__item:nth-child(3) .app-performer__remove');

    expect(backendSpy.deletePerformer).toHaveBeenCalledOnceWith(expectedPerformers[2].id);
  });
});
