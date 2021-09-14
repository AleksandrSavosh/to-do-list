import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { BackendService } from '../../backend.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-performer-form',
  templateUrl: './add-performer-form.component.html',
  styleUrls: ['./add-performer-form.component.scss']
})
export class AddPerformerFormComponent implements OnInit, OnDestroy {
  firstname = new FormControl(null, Validators.required);
  lastname = new FormControl(null, Validators.required);
  form = new FormGroup({
    firstname: this.firstname,
    lastname: this.lastname
  });
  success = false;

  private ngDestroy = new Subject();

  constructor(private backend: BackendService) {
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.ngDestroy))
      .subscribe(_ => this.success = false);
  }

  ngOnDestroy() {
    this.ngDestroy.next();
    this.ngDestroy.complete();
  }

  submit() {
    this.form.markAllAsTouched();
    Object.keys(this.form.controls).forEach(key => this.form.get(key)!.markAsDirty());

    if (this.form.valid) {
      this.form.disable();

      this.backend
        .addPerformer({ name: `${this.firstname.value} ${this.lastname.value}` })
        .pipe(takeUntil(this.ngDestroy))
        .subscribe(() => {
          this.backend.loadPerformers();
          this.form.enable();
          this.form.reset();
          this.success = true;
        });
    }
  }
}
