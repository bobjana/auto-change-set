import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICommit, Commit } from 'app/shared/model/commit.model';
import { CommitService } from './commit.service';
import { CommitComponent } from './commit.component';
import { CommitDetailComponent } from './commit-detail.component';
import { CommitUpdateComponent } from './commit-update.component';

@Injectable({ providedIn: 'root' })
export class CommitResolve implements Resolve<ICommit> {
  constructor(private service: CommitService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommit> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((commit: HttpResponse<Commit>) => {
          if (commit.body) {
            return of(commit.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Commit());
  }
}

export const commitRoute: Routes = [
  {
    path: '',
    component: CommitComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.commit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CommitDetailComponent,
    resolve: {
      commit: CommitResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.commit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CommitUpdateComponent,
    resolve: {
      commit: CommitResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.commit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CommitUpdateComponent,
    resolve: {
      commit: CommitResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'autoChangeSetApp.commit.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
