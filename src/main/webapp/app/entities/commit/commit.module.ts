import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoChangeSetSharedModule } from 'app/shared/shared.module';
import { CommitComponent } from './commit.component';
import { CommitDetailComponent } from './commit-detail.component';
import { CommitUpdateComponent } from './commit-update.component';
import { CommitDeleteDialogComponent } from './commit-delete-dialog.component';
import { commitRoute } from './commit.route';

@NgModule({
  imports: [AutoChangeSetSharedModule, RouterModule.forChild(commitRoute)],
  declarations: [CommitComponent, CommitDetailComponent, CommitUpdateComponent, CommitDeleteDialogComponent],
  entryComponents: [CommitDeleteDialogComponent]
})
export class AutoChangeSetCommitModule {}
