import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IChangeSet, ChangeSet } from 'app/shared/model/change-set.model';
import { ChangeSetService } from './change-set.service';

@Component({
  selector: 'jhi-change-set-update',
  templateUrl: './change-set-update.component.html'
})
export class ChangeSetUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    summary: [],
    released: [],
    date: []
  });

  constructor(protected changeSetService: ChangeSetService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ changeSet }) => {
      this.updateForm(changeSet);
    });
  }

  updateForm(changeSet: IChangeSet): void {
    this.editForm.patchValue({
      id: changeSet.id,
      title: changeSet.title,
      summary: changeSet.summary,
      released: changeSet.released,
      date: changeSet.date != null ? changeSet.date.format(DATE_TIME_FORMAT) : null
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const changeSet = this.createFromForm();
    if (changeSet.id !== undefined) {
      this.subscribeToSaveResponse(this.changeSetService.update(changeSet));
    } else {
      this.subscribeToSaveResponse(this.changeSetService.create(changeSet));
    }
  }

  private createFromForm(): IChangeSet {
    return {
      ...new ChangeSet(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      summary: this.editForm.get(['summary'])!.value,
      released: this.editForm.get(['released'])!.value,
      date: this.editForm.get(['date'])!.value != null ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChangeSet>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
