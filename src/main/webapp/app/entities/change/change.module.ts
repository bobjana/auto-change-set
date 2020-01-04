import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoChangeSetSharedModule } from 'app/shared/shared.module';
import { ChangeComponent } from './change.component';
import { ChangeDetailComponent } from './change-detail.component';
import { ChangeUpdateComponent } from './change-update.component';
import { ChangeDeleteDialogComponent } from './change-delete-dialog.component';
import { changeRoute } from './change.route';

@NgModule({
  imports: [AutoChangeSetSharedModule, RouterModule.forChild(changeRoute)],
  declarations: [ChangeComponent, ChangeDetailComponent, ChangeUpdateComponent, ChangeDeleteDialogComponent],
  entryComponents: [ChangeDeleteDialogComponent]
})
export class AutoChangeSetChangeModule {}
