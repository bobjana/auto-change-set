import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChangeSet } from 'app/shared/model/change-set.model';

@Component({
  selector: 'jhi-change-set-detail',
  templateUrl: './change-set-detail.component.html'
})
export class ChangeSetDetailComponent implements OnInit {
  changeSet: IChangeSet | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ changeSet }) => {
      this.changeSet = changeSet;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
