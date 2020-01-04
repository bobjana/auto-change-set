import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IChangeSet, ChangeSet } from 'app/shared/model/change-set.model';
import { ChangeSetService } from './change-set.service';
import { ChangeSetComponent } from './change-set.component';
import { ChangeSetDetailComponent } from './change-set-detail.component';
import { ChangeSetUpdateComponent } from './change-set-update.component';

@Injectable({ providedIn: 'root' })
export class ChangeSetResolve implements Resolve<IChangeSet> {
  constructor(private service: ChangeSetService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChangeSet> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((changeSet: HttpResponse<ChangeSet>) => {
          if (changeSet.body) {
            return of(changeSet.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChangeSet());
  }
}

export const changeSetRoute: Routes = [
  {
    path: '',
    component: ChangeSetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.changeSet.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ChangeSetDetailComponent,
    resolve: {
      changeSet: ChangeSetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.changeSet.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ChangeSetUpdateComponent,
    resolve: {
      changeSet: ChangeSetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.changeSet.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ChangeSetUpdateComponent,
    resolve: {
      changeSet: ChangeSetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.changeSet.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
