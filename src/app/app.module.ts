import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Inportacion del modulo encargado de Material
import{MaterialModule} from './material/material.module';

import { SidenavComponent } from './components/sidenav/sidenav.component';

//Importacion para trabajar con el formulario
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//Inportacion del servicio encargado de los registros
import {RegistrosService} from './services/registros.service';

//importaciones para el manejo de FireBase
import {environment} from '../environments/environment';
import{AngularFireModule,} from '@angular/fire';
import{AngularFirestoreModule,} from '@angular/fire/firestore';

//importacion para el manejo de responsive
import { FlexLayoutModule} from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';


   


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent
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

    //encargado del modo responsive
    FlexLayoutModule,

    LayoutModule,

    MatToolbarModule,

    MatButtonModule,

    MatSidenavModule,

    MatIconModule,

    MatListModule,

   

  ],
  providers: [
    //Servicio de firabese para BD
    RegistrosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
