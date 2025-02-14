import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { OficeComponent } from './pages/ofice/ofice.component';

const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' }, 



{path: 'login', component: LoginComponent},
{path: 'dashboard', component: DashboardComponent},
{path: 'agenda', component: AgendaComponent},
{path: 'ofice', component: OficeComponent}

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
