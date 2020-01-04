import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommit } from 'app/shared/model/commit.model';

@Component({
  selector: 'jhi-commit-detail',
  templateUrl: './commit-detail.component.html'
})
export class CommitDetailComponent implements OnInit {
  commit: ICommit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commit }) => {
      this.commit = commit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
