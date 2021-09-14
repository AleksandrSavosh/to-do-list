import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardComponent } from './task-card.component';
import { BackendService } from '../../../backend.service';
import { EditTaskModalService } from '../edit-task-modal/edit-task-modal.service';
import {
  clickOnButton,
  expectedIdPerformerMap,
  expectedTasks,
  getButton,
  getElement,
  getText,
  hasElement
} from '../../../../test-utils';
import { of, timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import SpyObj = jasmine.SpyObj;
import objectContaining = jasmine.objectContaining;

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let backendSpy: SpyObj<BackendService>;
  let editModalSpy: SpyObj<EditTaskModalService>;

  beforeEach(async () => {
    backendSpy = jasmine.createSpyObj(BackendService, ['updateTask', 'deleteTask', 'loadTasks']);
    editModalSpy = jasmine.createSpyObj(EditTaskModalService, ['show']);

    await TestBed.configureTestingModule({
      declarations: [TaskCardComponent],
      providers: [
        { provide: BackendService, useValue: backendSpy },
        { provide: EditTaskModalService, useValue: editModalSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = { ...expectedTasks[0], performer: expectedIdPerformerMap.get(expectedTasks[0].performerId)! };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show data', () => {
    const actualDescription = getText(fixture, '.app-task__description');
    const actualPerformer = getText(fixture, '.app-task__performer');
    const actualPriority = getText(fixture, '.app-task__priority');

    expect(actualDescription).toBe(expectedTasks[0].description);
    expect(actualPerformer).toBe(expectedIdPerformerMap.get(expectedTasks[0].performerId)!.name);
    expect(actualPriority).toBe(`${expectedTasks[0].priority}`);
  });

  it('should increase priority', () => {
    backendSpy.updateTask.and.returnValue(of(expectedTasks[0]));
    clickOnButton(fixture, 'button[data-increase-priority]');
    expect(backendSpy.updateTask).toHaveBeenCalledOnceWith(expectedTasks[0].id, {
      priority: expectedTasks[0].priority + 1
    });
    expect(backendSpy.loadTasks).toHaveBeenCalled();
  });

  it('should decrease priority and disable buttons during operation', async () => {
    backendSpy.updateTask.and.returnValue(of(expectedTasks[0]).pipe(delay(100)));

    clickOnButton(fixture, 'button[data-decrease-priority]');
    expect(backendSpy.updateTask).toHaveBeenCalledOnceWith(expectedTasks[0].id, {
      priority: expectedTasks[0].priority - 1
    });

    fixture.detectChanges();

    expect(getButton(fixture, 'button[data-complete]').disabled).toBeTruthy();
    expect(getButton(fixture, 'button[data-change]').disabled).toBeTruthy();
    expect(getButton(fixture, 'button[data-increase-priority]').disabled).toBeTruthy();
    expect(getButton(fixture, 'button[data-decrease-priority]').disabled).toBeTruthy();

    await timer(200).toPromise();
    fixture.detectChanges();

    expect(getButton(fixture, 'button[data-complete]').disabled).toBeFalsy();
    expect(getButton(fixture, 'button[data-change]').disabled).toBeFalsy();
    expect(getButton(fixture, 'button[data-increase-priority]').disabled).toBeFalsy();
    expect(getButton(fixture, 'button[data-decrease-priority]').disabled).toBeFalsy();

    expect(backendSpy.loadTasks).toHaveBeenCalled();
  });

  it('should mark task as completed and then remove task', () => {
    expect(hasElement(fixture, 'button[data-remove]')).toBeFalsy();

    backendSpy.updateTask.and.returnValue(of(expectedTasks[0]));
    clickOnButton(fixture, 'button[data-complete]');
    fixture.detectChanges();

    expect(backendSpy.updateTask).toHaveBeenCalledOnceWith(expectedTasks[0].id, { isCompleted: true });
    expect(backendSpy.loadTasks).toHaveBeenCalled();

    component.task = {
      ...expectedTasks[0],
      performer: expectedIdPerformerMap.get(expectedTasks[0].performerId)!,
      isCompleted: true
    };
    fixture.detectChanges();

    expect(hasElement(fixture, 'button[data-complete]')).toBeFalsy();
    expect(getElement(fixture, 'button[data-remove]')).toBeTruthy();

    backendSpy.deleteTask.and.returnValue(of(undefined));
    clickOnButton(fixture, 'button[data-remove]');

    expect(backendSpy.deleteTask).toHaveBeenCalledOnceWith(expectedTasks[0].id);
    expect(backendSpy.loadTasks).toHaveBeenCalled();
  });

  it('should open edit modal for task', () => {
    clickOnButton(fixture, 'button[data-change]');
    expect(editModalSpy.show).toHaveBeenCalledOnceWith(objectContaining(expectedTasks[0]));
  });

});
