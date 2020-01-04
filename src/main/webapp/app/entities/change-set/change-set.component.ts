import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChangeSet } from 'app/shared/model/change-set.model';
import { ChangeSetService } from './change-set.service';
import { ChangeSetDeleteDialogComponent } from './change-set-delete-dialog.component';

@Component({
  selector: 'jhi-change-set',
  templateUrl: './change-set.component.html'
})
export class ChangeSetComponent implements OnInit, OnDestroy {
  changeSets?: IChangeSet[];
  eventSubscriber?: Subscription;

  constructor(protected changeSetService: ChangeSetService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.changeSetService.query().subscribe((res: HttpResponse<IChangeSet[]>) => {
      this.changeSets = res.body ? res.body : [];
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInChangeSets();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IChangeSet): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInChangeSets(): void {
    this.eventSubscriber = this.eventManager.subscribe('changeSetListModification', () => this.loadAll());
  }

  delete(changeSet: IChangeSet): void {
    const modalRef = this.modalService.open(ChangeSetDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.changeSet = changeSet;
  }
}
