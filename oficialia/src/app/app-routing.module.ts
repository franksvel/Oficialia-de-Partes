import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { OficioComponent } from './pages/oficio/oficio.component';
import { MainComponent } from './pages/main/main.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CircularComponent } from './pages/circular/circular.component';
import { AuthGuard } from './auth.guard'; 
import { RegistrerComponent } from './auth/registrer/registrer.component';
import { ReportComponent } from './pages/report/report.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrer', component: RegistrerComponent },

  // Rutas protegidas por roles
  { path: 'main', component: MainComponent, canActivate: [AuthGuard], data: { roles: [1, 2, 3] } }, // Todos los roles pueden acceder
  { path: 'oficio', component: OficioComponent, canActivate: [AuthGuard], data: { roles: [1, 2, 3] } },
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard], data: { roles: [1, 3] } },
  { path: 'circular', component: CircularComponent, canActivate: [AuthGuard], data: { roles: [1, 2, 3] } },
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard], data: { roles: [1, 2] } },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { roles: [1, 2] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
