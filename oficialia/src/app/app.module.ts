import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { NavComponent } from './nav/nav.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CardComponent } from './components/card/card.component';
import { DashcontainerComponent } from './components/dashcontainer/dashcontainer.component';

import { OficeComponent } from './pages/ofice/ofice.component';
import { CrudtableComponent } from './components/crudtable/crudtable.component';
import {OAuthModule } from 'angular-oauth2-oidc'
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [

    AppComponent,
    DashboardComponent,
    LoginComponent,
    NavComponent,
    AgendaComponent,
    CardComponent,
    DashcontainerComponent,
    OficeComponent,
    CrudtableComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    HttpClientModule
 


  ],
  providers: [
    provideClientHydration(withEventReplay()),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
