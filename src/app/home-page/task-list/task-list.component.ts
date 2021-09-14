import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { Performer } from '../../models/performer';
import { BackendService } from '../../backend.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortOptions } from '../../shared/pipes/sort.pipe';
import { compare } from '../../../shame';

interface TaskView extends Task {
  performer: Performer
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  compare = compare;
  tasksViews$: Observable<TaskView[]> | undefined;
  sortOptions: SortOptions = { direction: 'desc', fields: ['priority'] };

  constructor(private backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.loadTasks();
    this.backend.loadPerformers();

    this.tasksViews$ = combineLatest([
      this.backend.getTasks(),
      this.backend.getIdPerformerMap()
    ]).pipe(map(data => {
      const tasks = data[0];
      const idPerformerMap = data[1];
      return tasks.map(task => ({ ...task, performer: idPerformerMap.get(task.performerId) } as TaskView))
    }));
  }
}
