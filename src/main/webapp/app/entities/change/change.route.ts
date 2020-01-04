import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IChange, Change } from 'app/shared/model/change.model';
import { ChangeService } from './change.service';
import { ChangeComponent } from './change.component';
import { ChangeDetailComponent } from './change-detail.component';
import { ChangeUpdateComponent } from './change-update.component';

@Injectable({ providedIn: 'root' })
export class ChangeResolve implements Resolve<IChange> {
  constructor(private service: ChangeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChange> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((change: HttpResponse<Change>) => {
          if (change.body) {
            return of(change.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Change());
  }
}

export const changeRoute: Routes = [
  {
    path: '',
    component: ChangeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.change.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ChangeDetailComponent,
    resolve: {
      change: ChangeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.change.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ChangeUpdateComponent,
    resolve: {
      change: ChangeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.change.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ChangeUpdateComponent,
    resolve: {
      change: ChangeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.change.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
