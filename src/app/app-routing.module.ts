import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//redireccion a la pagina de register
const routes: Routes = [
  { path: '', 
    redirectTo: '/home',
    pathMatch: 'full' },
 
    { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'register', loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
