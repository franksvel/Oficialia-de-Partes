import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { NavComponent } from './nav/nav.component';

const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' }, 



{path: 'login', component: LoginComponent},
{path: 'nav', component: NavComponent},


];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
