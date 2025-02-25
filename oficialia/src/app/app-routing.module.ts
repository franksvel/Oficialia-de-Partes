import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { OficioComponent } from './pages/oficio/oficio.component';
import { MainComponent } from './pages/main/main.component';


const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' }, 
{path: 'login', component: LoginComponent},
{path: 'main', component: MainComponent},
{path: 'oficio', component: OficioComponent},
// { path: 'circulares', component: CircularesComponent },
// { path: 'agenda', component: AgendaComponent },



];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
