import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [{ path: '', component: ProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  
  
  ],
  exports: [RouterModule,
    FormsModule,
    ReactiveFormsModule]
})
export class ProfileRoutingModule { }
