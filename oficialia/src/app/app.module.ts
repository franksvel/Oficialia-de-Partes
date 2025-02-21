import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import {OAuthModule } from 'angular-oauth2-oidc';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { SignUpComponent } from './auth/features/sign-up/sign-up.component';
import { SignInComponent } from './auth/features/sign-in/sign-in.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NavComponent } from './components/nav/nav.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CrudComponent } from './components/crud/crud.component';
import { OficioComponent } from './pages/oficio/oficio.component';
import { MainComponent } from './pages/main/main.component';


@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    SignUpComponent,
    SignInComponent,
    DashboardComponent,
    NavComponent,
    CrudComponent,
    OficioComponent,
    MainComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  
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
