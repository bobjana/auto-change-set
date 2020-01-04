import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IChange, Change } from 'app/shared/model/change.model';
import { ChangeService } from './change.service';
import { IChangeSet } from 'app/shared/model/change-set.model';
import { ChangeSetService } from 'app/entities/change-set/change-set.service';

@Component({
  selector: 'jhi-change-update',
  templateUrl: './change-update.component.html'
})
export class ChangeUpdateComponent implements OnInit {
  isSaving = false;

  changesets: IChangeSet[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    summary: [],
    hidden: [],
    authors: [],
    issueTrackingKey: [],
    changeSet: []
  });

  constructor(
    protected changeService: ChangeService,
    protected changeSetService: ChangeSetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ change }) => {
      this.updateForm(change);

      this.changeSetService
        .query()
        .pipe(
          map((res: HttpResponse<IChangeSet[]>) => {
            return res.body ? res.body : [];
          })
        )
        .subscribe((resBody: IChangeSet[]) => (this.changesets = resBody));
    });
  }

  updateForm(change: IChange): void {
    this.editForm.patchValue({
      id: change.id,
      title: change.title,
      summary: change.summary,
      hidden: change.hidden,
      authors: change.authors,
      issueTrackingKey: change.issueTrackingKey,
      changeSet: change.changeSet
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const change = this.createFromForm();
    if (change.id !== undefined) {
      this.subscribeToSaveResponse(this.changeService.update(change));
    } else {
      this.subscribeToSaveResponse(this.changeService.create(change));
    }
  }

  private createFromForm(): IChange {
    return {
      ...new Change(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      summary: this.editForm.get(['summary'])!.value,
      hidden: this.editForm.get(['hidden'])!.value,
      authors: this.editForm.get(['authors'])!.value,
      issueTrackingKey: this.editForm.get(['issueTrackingKey'])!.value,
      changeSet: this.editForm.get(['changeSet'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChange>>): void {
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

  trackById(index: number, item: IChangeSet): any {
    return item.id;
  }
}
