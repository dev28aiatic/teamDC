import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//redireccion a la pagina de register
const routes: Routes = [
  { path: 'register', 
    redirectTo: 'register',
    pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
