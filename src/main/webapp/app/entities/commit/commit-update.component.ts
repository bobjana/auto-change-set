import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ICommit, Commit } from 'app/shared/model/commit.model';
import { CommitService } from './commit.service';
import { IChange } from 'app/shared/model/change.model';
import { ChangeService } from 'app/entities/change/change.service';

@Component({
  selector: 'jhi-commit-update',
  templateUrl: './commit-update.component.html'
})
export class CommitUpdateComponent implements OnInit {
  isSaving = false;

  changes: IChange[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    author: [],
    date: [],
    change: []
  });

  constructor(
    protected commitService: CommitService,
    protected changeService: ChangeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commit }) => {
      this.updateForm(commit);

      this.changeService
        .query()
        .pipe(
          map((res: HttpResponse<IChange[]>) => {
            return res.body ? res.body : [];
          })
        )
        .subscribe((resBody: IChange[]) => (this.changes = resBody));
    });
  }

  updateForm(commit: ICommit): void {
    this.editForm.patchValue({
      id: commit.id,
      title: commit.title,
      author: commit.author,
      date: commit.date != null ? commit.date.format(DATE_TIME_FORMAT) : null,
      change: commit.change
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commit = this.createFromForm();
    if (commit.id !== undefined) {
      this.subscribeToSaveResponse(this.commitService.update(commit));
    } else {
      this.subscribeToSaveResponse(this.commitService.create(commit));
    }
  }

  private createFromForm(): ICommit {
    return {
      ...new Commit(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      author: this.editForm.get(['author'])!.value,
      date: this.editForm.get(['date'])!.value != null ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      change: this.editForm.get(['change'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommit>>): void {
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

  trackById(index: number, item: IChange): any {
    return item.id;
  }
}
