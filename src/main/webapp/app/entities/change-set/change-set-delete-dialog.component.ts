import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IChangeSet } from 'app/shared/model/change-set.model';
import { ChangeSetService } from './change-set.service';

@Component({
  templateUrl: './change-set-delete-dialog.component.html'
})
export class ChangeSetDeleteDialogComponent {
  changeSet?: IChangeSet;

  constructor(protected changeSetService: ChangeSetService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.changeSetService.delete(id).subscribe(() => {
      this.eventManager.broadcast('changeSetListModification');
      this.activeModal.close();
    });
  }
}
