import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformersPageComponent } from './performers-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PerformersListComponent } from './performers-list/performers-list.component';
import { AddPerformerFormComponent } from './add-performer-form/add-performer-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PerformersPageComponent,
    PerformersListComponent,
    AddPerformerFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PerformersPageModule {
}
