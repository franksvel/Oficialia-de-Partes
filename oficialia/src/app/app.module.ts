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
import {OAuthModule } from 'angular-oauth2-oidc';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { SignUpComponent } from './auth/features/sign-up/sign-up.component';
import { SignInComponent } from './auth/features/sign-in/sign-in.component'





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
    CrudtableComponent,
    SignUpComponent,
    SignInComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    
   

 


  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp({ projectId: "oficialia-d3a32", appId: "1:849796925257:web:d6279ea69ecb45aee8bc98", storageBucket: "oficialia-d3a32.firebasestorage.app", apiKey: "AIzaSyBBNd7sZ6P-uyQOIVL0qgdtbv4Am7oEkzg", authDomain: "oficialia-d3a32.firebaseapp.com", messagingSenderId: "849796925257", measurementId: "G-6YSJ0BKR92" })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
