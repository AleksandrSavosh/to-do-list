import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TaskCardModel } from './task-card.model';
import { Task } from '../../../models/task';
import { BackendService } from '../../../backend.service';
import { EditTaskModalComponent } from '../edit-task-modal/edit-task-modal.component';
import { EditTaskModalService } from '../edit-task-modal/edit-task-modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit, OnDestroy {
  @ViewChild(EditTaskModalComponent, { static: true }) modal: EditTaskModalComponent | undefined;
  @Input() task: TaskCardModel | undefined;
  disabled = false;

  private ngDestroy = new Subject();

  constructor(private backend: BackendService, private editModalService: EditTaskModalService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  changePriority(task: Task, delta: -1 | 1): void {
    this.disabled = true;
    this.backend
      .updateTask(task.id, { priority: task.priority + delta })
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(_ => {
        this.disabled = false;
        this.backend.loadTasks();
      });
  }

  removeTask(task: Task): void {
    this.disabled = true;
    this.backend
      .deleteTask(task.id)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        this.disabled = false;
        this.backend.loadTasks();
      });
  }

  editTask(task: Task): void {
    this.editModalService.show(task);
  }

  completeTask(task: Task) {
    this.disabled = true;
    this.backend
      .updateTask(task.id, { isCompleted: true })
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(() => {
        this.disabled = false;
        this.backend.loadTasks();
      });
  }
}
