import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { OficioComponent } from './pages/oficio/oficio.component';
import { MainComponent } from './pages/main/main.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CircularComponent } from './pages/circular/circular.component';
import { AuthGuard } from './auth.guard'; 
import { RegistrerComponent } from './auth/registrer/registrer.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrer', component: RegistrerComponent},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] }, 
  { path: 'oficio', component: OficioComponent, canActivate: [AuthGuard] }, 
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] }, 
  { path: 'circular', component: CircularComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
