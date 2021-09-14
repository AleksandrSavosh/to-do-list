import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Performer } from './models/performer';
import { environment } from '../environments/environment';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { Task } from './models/task';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private tasks$ = new ReplaySubject<Task[]>(1);
  private performers$ = new ReplaySubject<Performer[]>(1);
  private tasksSubscription: Subscription | undefined;
  private performersSubscription: Subscription | undefined;

  constructor(private client: HttpClient) {
  }

  getPerformers(): Observable<Performer[]> {
    return this.performers$;
  }

  getIdPerformerMap(): Observable<Map<number, Performer>> {
    return this.performers$.pipe(
      map(performers => performers.reduce((map, performer) => {
          map.set(performer.id, performer);
          return map;
        },
        new Map<number, Performer>()))
    );
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.client.post<Task>(`${environment.backendBaseUrl}/tasks`, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.client.patch<Task>(`${environment.backendBaseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.client.delete<void>(`${environment.backendBaseUrl}/tasks/${id}`);
  }

  loadTasks(): void {
    if (this.tasksSubscription && !this.tasksSubscription.closed) {
      this.tasksSubscription.unsubscribe();
    }
    this.tasksSubscription = this.client
      .get<Task[]>(`${environment.backendBaseUrl}/tasks`)
      .subscribe(tasks => this.tasks$.next(tasks));
  }

  loadPerformers() {
    if (this.performersSubscription && !this.performersSubscription.closed) {
      this.performersSubscription.unsubscribe();
    }
    this.performersSubscription = this.client
      .get<Performer[]>(`${environment.backendBaseUrl}/performers`)
      .subscribe(performers => this.performers$.next(performers));
  }

  addPerformer(performer: Omit<Performer, 'id'>): Observable<Performer> {
    return this.client.post<Performer>(`${environment.backendBaseUrl}/performers`, performer);
  }

  deletePerformer(performerId: number) {
    return this.client.delete<void>(`${environment.backendBaseUrl}/performers/${performerId}`);
  }
}
