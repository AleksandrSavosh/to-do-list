import { BackendService } from './backend.service';
import { HttpClient } from '@angular/common/http';
import { of, timer } from 'rxjs';
import { environment } from '../environments/environment';
import { Task } from './models/task';
import { expectedIdPerformerMap, expectedPerformers, expectedTasks } from '../test-utils';
import { delay, first, takeUntil, tap } from 'rxjs/operators';
import { Performer } from './models/performer';
import SpyObj = jasmine.SpyObj;

describe('BackendService', () => {
  let httpClientSpy: SpyObj<HttpClient>;
  let service: BackendService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
    service = new BackendService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPerformers, getIdPerformerMap and loadPerformers', () => {
    it('should return expected performers', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/performers`

      httpClientSpy.get.and.returnValue(of(expectedPerformers).pipe(delay(100)));

      service.loadPerformers();
      service.loadPerformers();
      await timer(50);
      service.loadPerformers();

      let numberOfEmittedValues = 0;
      const actualPerformers = await service.getPerformers().pipe(
        tap(() => numberOfEmittedValues++),
        takeUntil(timer(200))
      ).toPromise();

      expect(numberOfEmittedValues).toBe(1);
      expect(httpClientSpy.get).not.toHaveBeenCalledOnceWith(expectedUrl);
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
      expect(actualPerformers).toEqual(expectedPerformers);
    });

    it('should return expected performers map', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/performers`

      httpClientSpy.get.and.returnValue(of(expectedPerformers));

      service.loadPerformers();
      const actualPerformers = await service.getIdPerformerMap().pipe(first()).toPromise();

      expect(httpClientSpy.get).toHaveBeenCalledOnceWith(expectedUrl);
      expect(actualPerformers).toEqual(expectedIdPerformerMap);
    });
  });

  describe('getTasks and loadTasks', () => {
    it('should return tasks', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/tasks`

      httpClientSpy.get.and.returnValue(of(expectedTasks).pipe(delay(100)));

      service.loadTasks();
      await timer(50);
      service.loadTasks();

      let numberOfEmittedValues = 0;
      const actualTask = await service.getTasks().pipe(
        tap(() => numberOfEmittedValues++),
        takeUntil(timer(200))
      ).toPromise();

      expect(numberOfEmittedValues).toBe(1);
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
      expect(actualTask).toEqual(expectedTasks);
    });
  });

  describe('addTask', () => {
    it('should add and return task', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/tasks`
      const expectedTask: Omit<Task, 'id'> = {
        description: expectedTasks[0].description,
        priority: expectedTasks[0].priority,
        created: expectedTasks[0].created,
        performerId: expectedTasks[0].performerId,
        isCompleted: expectedTasks[0].isCompleted
      };

      httpClientSpy.post.and.returnValue(of(expectedTasks[0]));

      const actualTask = await service.addTask(expectedTask).toPromise();

      expect(httpClientSpy.post).toHaveBeenCalledOnceWith(expectedUrl, expectedTask);
      expect(actualTask).toEqual(expectedTasks[0]);
    });
  });

  describe('updateTask', () => {
    it('should update task and return task', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/tasks/${expectedTasks[0].id}`;

      httpClientSpy.patch.and.returnValue(of(expectedTasks[0]));

      const actualTask = await service.updateTask(expectedTasks[0].id, expectedTasks[0]).toPromise();

      expect(httpClientSpy.patch).toHaveBeenCalledOnceWith(expectedUrl, expectedTasks[0]);
      expect(actualTask).toEqual(expectedTasks[0]);
    });
  });

  describe('deleteTask', () => {
    it('should remove task', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/tasks/${expectedTasks[0].id}`;

      httpClientSpy.delete.and.returnValue(of());

      await service.deleteTask(expectedTasks[0].id).toPromise();

      expect(httpClientSpy.delete).toHaveBeenCalledOnceWith(expectedUrl);
    });
  });

  describe('deletePerformer', () => {
    it('should remove performer', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/performers/${expectedPerformers[0].id}`;

      httpClientSpy.delete.and.returnValue(of());

      await service.deletePerformer(expectedPerformers[0].id).toPromise();

      expect(httpClientSpy.delete).toHaveBeenCalledOnceWith(expectedUrl);
    });
  });

  describe('addPerformer', () => {
    it('should add and return performer', async () => {
      const expectedUrl = `${environment.backendBaseUrl}/performers`
      const expectedPerformer: Omit<Performer, 'id'> = {
        name: expectedPerformers[0].name
      };

      httpClientSpy.post.and.returnValue(of(expectedPerformers[0]));

      const actualTask = await service.addPerformer(expectedPerformer).toPromise();

      expect(httpClientSpy.post).toHaveBeenCalledOnceWith(expectedUrl, expectedPerformer);
      expect(actualTask).toEqual(expectedPerformers[0]);
    });
  });
});
