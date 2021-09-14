import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { compare } from '../../../shame';
import { Performer } from '../../models/performer';
import { BackendService } from '../../backend.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnChanges, OnInit, OnDestroy {
  compare = compare;
  @Input() task: Task | undefined;

  description = new FormControl(null, Validators.required);
  performer = new FormControl(null, Validators.required);
  priority = new FormControl(null, [
    Validators.required,
    Validators.min(0),
    Validators.max(9)
  ]);
  form = new FormGroup({
    description: this.description,
    performer: this.performer,
    priority: this.priority
  });

  performers$: Observable<Performer[]> | undefined;
  mode: 'create' | 'update' = 'create';
  success = false;
  private ngDestroy = new Subject();

  constructor(private backend: BackendService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    /* istanbul ignore else */
    if (changes.task && changes.task.previousValue !== changes.task.currentValue) {
      const task = changes.task.currentValue;
      this.mode = task ? 'update' : /* istanbul ignore next */ 'create';

      /* istanbul ignore else */
      if (this.mode === 'update') {
        this.backend.getIdPerformerMap().pipe(
          takeUntil(this.ngDestroy),
          first()
        ).subscribe(idPerformerMap => {
          this.form.patchValue({
            description: task.description,
            performer: idPerformerMap.get(task.performerId),
            priority: task.priority
          });
        });
      }
    }
  }

  ngOnInit(): void {
    this.performers$ = this.backend.getPerformers();
    this.backend.loadPerformers();
    this.form.valueChanges
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(_ => this.success = false);
  }

  ngOnDestroy(): void {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  submit(): void {
    this.form.markAllAsTouched();
    Object.keys(this.form.controls).forEach(key => this.form.get(key)!.markAsDirty());

    if (this.form.valid) {
      this.form.disable();

      const data = {
        description: this.description.value,
        performerId: this.performer.value.id,
        priority: this.priority.value,
        created: this.mode === 'create' ? new Date().toISOString() : this.task!.created,
        isCompleted: this.mode === 'create' ? false : this.task!.isCompleted,
      };

      const observable = this.mode === 'create' ?
        this.backend.addTask(data) :
        this.backend.updateTask(this.task!.id, data);

      observable
        .pipe(takeUntil(this.ngDestroy))
        .subscribe(_ => {
          this.backend.loadTasks();
          this.form.enable();

          if (this.mode === 'create') {
            this.form.reset();
          }

          this.success = true;
        });
    }
  }
}
