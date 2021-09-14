import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../models/task';
import { EditTaskModalService } from './edit-task-modal.service';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent implements OnInit {
  @Input() task: Task | undefined;

  constructor(private editModalService: EditTaskModalService) {
  }

  ngOnInit(): void {
  }

  close() {
    this.editModalService.hide();
  }
}
