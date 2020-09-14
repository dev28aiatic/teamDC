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
import { environment } from '../environments/environment';
import{ AngularFireModule } from '@angular/fire';
import{ AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule} from '@angular/fire/auth';


//Con este modulo no necesitas usar fetch ni ajax ni nada para llamadas a apis
import { HttpClientModule } from "@angular/common/http";

//importacion para el manejo de responsive
import { FlexLayoutModule} from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DialogComponent } from './components/dialog/dialog.component';
import { YouTubePlayerModule }  from  '@angular/youtube-player' ;
import { AngularFireStorageModule } from '@angular/fire/storage';
<<<<<<< HEAD
import { FooterComponent } from './components/footer/footer.component';
=======
import { AuthService } from './services/auth.service';
import { ContactComponent } from './components/contact/contact.component';
>>>>>>> master


   


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    DialogComponent,
<<<<<<< HEAD
    FooterComponent
=======
    ContactComponent
>>>>>>> master
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    //Importaciones de FireBase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule, 

    //para llamadas http
    HttpClientModule,

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

    //para embeber videos de youtube
    YouTubePlayerModule,

    //para subir la imagen al storage
    AngularFireStorageModule,

   

  ],
  providers: [
    //Servicio de firabese para BD
    RegistrosService,
    // servicio para la autentificacion
    AuthService,
    //servicio de api
    //MunicipiosColombiaService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
