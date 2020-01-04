import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IChange } from 'app/shared/model/change.model';
import { ChangeService } from './change.service';

@Component({
  templateUrl: './change-delete-dialog.component.html'
})
export class ChangeDeleteDialogComponent {
  change?: IChange;

  constructor(protected changeService: ChangeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.changeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('changeListModification');
      this.activeModal.close();
    });
  }
}
