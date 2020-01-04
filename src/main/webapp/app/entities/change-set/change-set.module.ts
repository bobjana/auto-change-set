import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoChangeSetSharedModule } from 'app/shared/shared.module';
import { ChangeSetComponent } from './change-set.component';
import { ChangeSetDetailComponent } from './change-set-detail.component';
import { ChangeSetUpdateComponent } from './change-set-update.component';
import { ChangeSetDeleteDialogComponent } from './change-set-delete-dialog.component';
import { changeSetRoute } from './change-set.route';

@NgModule({
  imports: [AutoChangeSetSharedModule, RouterModule.forChild(changeSetRoute)],
  declarations: [ChangeSetComponent, ChangeSetDetailComponent, ChangeSetUpdateComponent, ChangeSetDeleteDialogComponent],
  entryComponents: [ChangeSetDeleteDialogComponent]
})
export class AutoChangeSetChangeSetModule {}
