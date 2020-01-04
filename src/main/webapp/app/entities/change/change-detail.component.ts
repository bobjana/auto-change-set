import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChange } from 'app/shared/model/change.model';

@Component({
  selector: 'jhi-change-detail',
  templateUrl: './change-detail.component.html'
})
export class ChangeDetailComponent implements OnInit {
  change: IChange | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ change }) => {
      this.change = change;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
