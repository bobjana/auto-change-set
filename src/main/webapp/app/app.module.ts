import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { AutoChangeSetSharedModule } from 'app/shared/shared.module';
import { AutoChangeSetCoreModule } from 'app/core/core.module';
import { AutoChangeSetAppRoutingModule } from './app-routing.module';
import { AutoChangeSetHomeModule } from './home/home.module';
import { AutoChangeSetEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    AutoChangeSetSharedModule,
    AutoChangeSetCoreModule,
    AutoChangeSetHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AutoChangeSetEntityModule,
    AutoChangeSetAppRoutingModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent]
})
export class AutoChangeSetAppModule {}
