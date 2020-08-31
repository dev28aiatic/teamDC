import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//redireccion a la pagina de register
const routes: Routes = [
  { path: '', 
    redirectTo: '/home',
    pathMatch: 'full' },
 
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'register', loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule) },
  { path: 'records', loadChildren: () => import('./components/records/records.module').then(m => m.RecordsModule) },
  { path: 'video', loadChildren: () => import('./components/video/video.module').then(m => m.VideoModule) },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
