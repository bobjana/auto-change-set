import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommit } from 'app/shared/model/commit.model';
import { CommitService } from './commit.service';
import { CommitDeleteDialogComponent } from './commit-delete-dialog.component';

@Component({
  selector: 'jhi-commit',
  templateUrl: './commit.component.html'
})
export class CommitComponent implements OnInit, OnDestroy {
  commits?: ICommit[];
  eventSubscriber?: Subscription;

  constructor(protected commitService: CommitService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.commitService.query().subscribe((res: HttpResponse<ICommit[]>) => {
      this.commits = res.body ? res.body : [];
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCommits();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICommit): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCommits(): void {
    this.eventSubscriber = this.eventManager.subscribe('commitListModification', () => this.loadAll());
  }

  delete(commit: ICommit): void {
    const modalRef = this.modalService.open(CommitDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.commit = commit;
  }
}
