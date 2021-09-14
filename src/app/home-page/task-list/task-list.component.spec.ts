import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { BackendService } from '../../backend.service';
import { expectedIdPerformerMap, expectedTasks, selectValue } from '../../../test-utils';
import { of } from 'rxjs';
import { SortPipe } from '../../shared/pipes/sort.pipe';
import { FormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let backendSpy: SpyObj<BackendService>;

  beforeEach(async () => {
    backendSpy = jasmine.createSpyObj(BackendService, [
      'loadTasks', 'loadPerformers', 'getTasks', 'getIdPerformerMap'
    ]);
    backendSpy.getTasks.and.returnValue(of(expectedTasks));
    backendSpy.getIdPerformerMap.and.returnValue(of(expectedIdPerformerMap));
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [TaskListComponent, SortPipe, TaskCardMockComponent],
      providers: [
        { provide: BackendService, useValue: backendSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort task cards by priority', () => {
    const getPriorities = () => fixture.debugElement
      .queryAll(By.css('app-task-card'))
      .map(de => de.componentInstance.task.priority);

    const expectedPriorities = expectedTasks.map(task => task.priority);
    expectedPriorities.sort();

    //by default component should render task by priority desc
    expect(getPriorities()).toEqual(expectedPriorities.sort().reverse());

    // select ordering by priority asc
    selectValue(fixture, 'select', 1);
    fixture.detectChanges();

    expect(getPriorities()).toEqual(expectedPriorities.sort());
  });
});

@Component({
  selector: 'app-task-card',
  template: '<div>{{ task | json }}</div>'
})
class TaskCardMockComponent {
  @Input() task: any;
}
