import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChange } from 'app/shared/model/change.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ChangeService } from './change.service';
import { ChangeDeleteDialogComponent } from './change-delete-dialog.component';

@Component({
  selector: 'jhi-change',
  templateUrl: './change.component.html'
})
export class ChangeComponent implements OnInit, OnDestroy {
  changes: IChange[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected changeService: ChangeService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.changes = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.changeService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IChange[]>) => this.paginateChanges(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.changes = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInChanges();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IChange): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInChanges(): void {
    this.eventSubscriber = this.eventManager.subscribe('changeListModification', () => this.reset());
  }

  delete(change: IChange): void {
    const modalRef = this.modalService.open(ChangeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.change = change;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateChanges(data: IChange[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.changes.push(data[i]);
      }
    }
  }
}
