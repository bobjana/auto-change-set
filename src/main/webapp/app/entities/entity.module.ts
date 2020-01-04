import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'change-set',
        loadChildren: () => import('./change-set/change-set.module').then(m => m.AutoChangeSetChangeSetModule)
      },
      {
        path: 'change',
        loadChildren: () => import('./change/change.module').then(m => m.AutoChangeSetChangeModule)
      },
      {
        path: 'commit',
        loadChildren: () => import('./commit/commit.module').then(m => m.AutoChangeSetCommitModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class AutoChangeSetEntityModule {}
