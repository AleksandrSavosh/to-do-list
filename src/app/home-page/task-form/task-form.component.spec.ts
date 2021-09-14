import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { By } from '@angular/platform-browser';
import {
  clickOnButton,
  expectedIdPerformerMap,
  expectedPerformers,
  expectedTasks,
  getElement,
  getInputElement,
  getSelect,
  getTextAreaElement,
  hasElement,
  inputValue,
  selectValue,
  textValue
} from '../../../test-utils';
import { BackendService } from '../../backend.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import SpyObj = jasmine.SpyObj;


describe('TaskFormComponent', () => {
  let backend: SpyObj<BackendService>;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(expectedTasks[0].created));

    backend = jasmine.createSpyObj(BackendService, [
      'getPerformers', 'loadPerformers', 'getIdPerformerMap', 'addTask', 'loadTasks', 'updateTask'
    ]);
    backend.getPerformers.and.returnValue(of(expectedPerformers));
    backend.getIdPerformerMap.and.returnValue(of(expectedIdPerformerMap));
    backend.addTask.and.returnValue(of(expectedTasks[0]));
    backend.updateTask.and.returnValue(of(expectedTasks[0]));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('create mode', () => {
    let component: TaskFormComponent;
    let fixture: ComponentFixture<TaskFormComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [TaskFormComponent],
        providers: [{ provide: BackendService, useValue: backend }]
      })
        .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TaskFormComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create component and call load performers method', () => {
      expect(component).toBeTruthy();
      expect(backend.loadPerformers).toHaveBeenCalled();
    });

    it('should display performers', () => {
      const optionsBe = fixture.debugElement.queryAll(By.css('option'));
      expect(optionsBe[0].nativeElement.textContent).toBeTruthy();
      expect(optionsBe[1].nativeElement.textContent).toBe(expectedPerformers[0].name);
      expect(optionsBe[2].nativeElement.textContent).toBe(expectedPerformers[1].name);
    });

    it('should show errors', () => {
      expect(hasElement(fixture, '[data-error-description]')).toBeFalsy();
      expect(hasElement(fixture, '[data-error-performer]')).toBeFalsy();
      expect(hasElement(fixture, '[data-error-priority]')).toBeFalsy();
      expect(hasElement(fixture, '[data-error-priority-not-in-range]')).toBeFalsy();

      clickOnButton(fixture, '[data-submit]');
      fixture.detectChanges();

      expect(getElement(fixture, '[data-error-description]')).toBeTruthy();
      expect(getElement(fixture, '[data-error-performer]')).toBeTruthy();
      expect(getElement(fixture, '[data-error-priority]')).toBeTruthy();

      inputValue(fixture, '#priority', 100);
      fixture.detectChanges();

      expect(getElement(fixture, '[data-error-priority-not-in-range]')).toBeTruthy();
    });

    it('should call add task method and show success message', () => {
      textValue(fixture, '#description', expectedTasks[0].description);
      selectValue(fixture, '#performer', 1);
      inputValue(fixture, '#priority', expectedTasks[0].priority);

      clickOnButton(fixture, '[data-submit]');
      fixture.detectChanges();

      expect(backend.addTask).toHaveBeenCalledOnceWith({
        description: expectedTasks[0].description,
        priority: expectedTasks[0].priority,
        created: expectedTasks[0].created,
        performerId: expectedTasks[0].performerId,
        isCompleted: expectedTasks[0].isCompleted
      });
      expect(backend.loadTasks).toHaveBeenCalled();

      expect(getElement(fixture, '[data-success]')).toBeTruthy();
      expect(getTextAreaElement(fixture, '#description').value).toBe('');
      expect(getInputElement(fixture, '#priority').value).toBe('');
    });
  });


  describe('update mode', () => {
    let testingComponent: TaskFormTestingComponent;
    let fixture: ComponentFixture<TaskFormTestingComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [TaskFormComponent, TaskFormTestingComponent],
        providers: [{ provide: BackendService, useValue: backend }]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TaskFormTestingComponent);
      testingComponent = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should set "update" mode and call get id-performer map method', () => {
      expect(testingComponent.component!.mode).toBe('update');
      expect(backend.getIdPerformerMap).toHaveBeenCalled();
    });

    it('should display selected performer', () => {
      const select = getSelect(fixture, '#performer')
      const options = select.options;
      const selectedIndex = options.selectedIndex;

      expect(options[selectedIndex].textContent).toBe(expectedPerformers[0].name);
    });

    it('should call update task method', () => {
      const expectedPriority = 9;

      inputValue(fixture, '#priority', expectedPriority);
      clickOnButton(fixture, '[data-submit]');
      fixture.detectChanges();


      expect(backend.updateTask).toHaveBeenCalledOnceWith(expectedTasks[0].id, {
        description: expectedTasks[0].description,
        priority: expectedPriority,
        created: expectedTasks[0].created,
        performerId: expectedTasks[0].performerId,
        isCompleted: expectedTasks[0].isCompleted
      });
      expect(backend.loadTasks).toHaveBeenCalled();
      expect(getElement(fixture, '[data-success]')).toBeTruthy();
      expect(getInputElement(fixture, '#priority').value).toBe(`${expectedPriority}`);
    });
  });
});

@Component({
  template: `
    <app-task-form [task]="expectedTask"></app-task-form>
  `
})
class TaskFormTestingComponent {
  expectedTask = expectedTasks[0];
  @ViewChild(TaskFormComponent, { static: true }) component: TaskFormComponent | undefined;
}
