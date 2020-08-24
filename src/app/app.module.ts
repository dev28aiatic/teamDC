import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Inportacion del modulo encargado de Material
import{MaterialModule} from './material/material.module';
import { RegisterComponent } from './components/register/register.component';

//Importacion para trabajar con el formulario
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//Inportacion del servicio encargado de los registros
import {RegistrosService} from './services/registros.service';

//importaciones para el manejo de FireBase
import {environment} from '../environments/environment';
import{AngularFireModule,} from '@angular/fire';
import{AngularFirestoreModule,} from '@angular/fire/firestore';

   


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    //Importaciones de FireBase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    //Modulo encargado de Material
    MaterialModule,

    //Encargado del formulario
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    //Servicio de firabese para BD
    RegistrosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
