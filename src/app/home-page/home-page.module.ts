import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page.component';
import { SharedModule } from '../shared/shared.module';
import { TaskListComponent } from './task-list/task-list.component';
import { EditTaskModalComponent } from './task-list/edit-task-modal/edit-task-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskCardComponent } from './task-list/task-card/task-card.component';


@NgModule({
  declarations: [
    HomePageComponent,
    TaskFormComponent,
    TaskListComponent,
    EditTaskModalComponent,
    TaskCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomePageModule {
}
