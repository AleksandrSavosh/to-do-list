import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';
import { Task } from '../../models/task';
import { BackendService } from '../../backend.service';
import { PerformerListItemModel } from './performer-list-item.model';

@Component({
  selector: 'app-performers-list',
  templateUrl: './performers-list.component.html',
  styleUrls: ['./performers-list.component.scss']
})
export class PerformersListComponent implements OnInit {
  performers$: Observable<PerformerListItemModel[]> | undefined;

  private ngDestroy = new Subject();

  constructor(private backend: BackendService) {
  }

  ngOnInit(): void {
    this.backend.loadPerformers();
    this.backend.loadTasks();

    this.initPerformersObservable();
  }

  ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  deletePerformer(performerId: number) {
    this.backend.deletePerformer(performerId)
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(() => this.backend.loadPerformers());
  }

  private initPerformersObservable(): void {
    this.performers$ = combineLatest([
      this.backend.getPerformers(),
      this.backend.getTasks()
    ]).pipe(map(data => {
      const performers = data[0];
      const tasks = data[1];

      const performerIdTasksMap = tasks.reduce((map, task) => {
        if (!map.has(task.performerId)) {
          map.set(task.performerId, []);
        }

        map.get(task.performerId)!.push(task);
        return map;
      }, new Map<number, Task[]>());

      return performers.map(performer => {
        const numberOfTasks = performerIdTasksMap.has(performer.id) ? performerIdTasksMap.get(performer.id)!.length : 0;
        return ({ ...performer, numberOfTasks } as PerformerListItemModel);
      });
    }));
  }
}
