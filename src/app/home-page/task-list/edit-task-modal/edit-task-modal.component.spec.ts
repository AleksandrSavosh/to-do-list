import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskModalComponent } from './edit-task-modal.component';
import { EditTaskModalService } from './edit-task-modal.service';
import { Component, Input, ViewChild } from '@angular/core';
import { clickOnButton, expectedTasks } from '../../../../test-utils';
import { By } from '@angular/platform-browser';
import { Task } from '../../../models/task';
import SpyObj = jasmine.SpyObj;

describe('EditTaskModalComponent', () => {
  let modalService: SpyObj<EditTaskModalService>;
  let testingComponent: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;

  beforeEach(async () => {
    modalService = jasmine.createSpyObj(EditTaskModalService, ['hide']);
    await TestBed.configureTestingModule({
      declarations: [EditTaskModalComponent, TestingComponent, TaskFormMockComponent],
      providers: [
        { provide: EditTaskModalService, useValue: modalService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingComponent);
    testingComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testingComponent.component).toBeTruthy();
  });

  it('should set task to another component', () => {
    const taskFormDe = fixture.debugElement.query(By.css('app-task-form'));
    expect(taskFormDe.componentInstance!.task).toEqual(expectedTasks[0]);
  });

  it('should hide modal', () => {
    clickOnButton(fixture, '.app-close');
    expect(modalService.hide).toHaveBeenCalled();
  });
});

@Component({
  selector: 'app-task-form',
  template: ''
})
class TaskFormMockComponent {
  @Input() task: Task | undefined;
}

@Component({
  template: '<app-edit-task-modal [task]="task"></app-edit-task-modal>'
})
class TestingComponent {
  task = expectedTasks[0];
  @ViewChild(EditTaskModalComponent, { static: true }) component: EditTaskModalComponent | undefined;
  @ViewChild(TaskFormMockComponent, { static: false }) taskFormComponent: TaskFormMockComponent | undefined;
}

