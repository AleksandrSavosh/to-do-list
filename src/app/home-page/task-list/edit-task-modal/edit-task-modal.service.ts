import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  Injector
} from '@angular/core';
import { DOCUMENT } from '../../../app.tokens';
import { EditTaskModalComponent } from './edit-task-modal.component';
import { Task } from '../../../models/task';

@Injectable({
  providedIn: 'root'
})
export class EditTaskModalService {
  private componentRef: ComponentRef<EditTaskModalComponent> | undefined;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  show(task: Task): void {
    if (this.componentRef) {
      this.hide();
    }

    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(EditTaskModalComponent)
      .create(this.injector);

    this.componentRef.instance.task = task;

    this.appRef.attachView(this.componentRef.hostView);

    const element = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(element);
  }

  hide(): void {
    if (!this.componentRef) {
      return;
    }

    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = undefined;
  }
}
