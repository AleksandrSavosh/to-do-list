import { inject, TestBed } from '@angular/core/testing';

import { EditTaskModalService } from './edit-task-modal.service';
import { expectedTasks } from '../../../../test-utils';
import { BackendService } from '../../../backend.service';
import { DOCUMENT } from '../../../app.tokens';

describe('EditTaskModalService', () => {
  let service: EditTaskModalService;

  beforeEach(() => {
    const backendMock = jasmine.createSpyObj(BackendService, ['.']);
    TestBed.configureTestingModule({
      declarations: [],
      providers: [{ provide: BackendService, useValue: backendMock }]
    });
    service = TestBed.inject(EditTaskModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show and hide component', inject([DOCUMENT], (document: Document) => {
    const getModalElement = () => document.body.getElementsByTagName('app-edit-task-modal')[0];

    expect(getModalElement()).toBeFalsy();

    service.show(expectedTasks[0]);
    expect(getModalElement()).toBeTruthy();

    service.hide();
    expect(getModalElement()).toBeFalsy();
  }));

  it('should attach to body only one modal if show method is called twice', () => {
    service.show(expectedTasks[0]);
    service.show(expectedTasks[0]);
    expect(document.body.getElementsByTagName('app-edit-task-modal').length).toBe(1);
  });

  it('should do nothing if hide method is called', () => {
    service.hide();
    expect(document.body.getElementsByTagName('app-edit-task-modal').length).toBe(0);
  });
});
