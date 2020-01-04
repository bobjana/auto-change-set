import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICommit } from 'app/shared/model/commit.model';
import { CommitService } from './commit.service';

@Component({
  templateUrl: './commit-delete-dialog.component.html'
})
export class CommitDeleteDialogComponent {
  commit?: ICommit;

  constructor(protected commitService: CommitService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commitService.delete(id).subscribe(() => {
      this.eventManager.broadcast('commitListModification');
      this.activeModal.close();
    });
  }
}
