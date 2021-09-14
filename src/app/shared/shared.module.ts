import { NgModule } from '@angular/core';
import { SortPipe } from './pipes/sort.pipe';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SortPipe,
    NavigationBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SortPipe,
    NavigationBarComponent
  ]
})
export class SharedModule {
}
