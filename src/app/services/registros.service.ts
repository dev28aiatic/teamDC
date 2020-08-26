import { Injectable } from '@angular/core';

//importaciones para gestionar el servicio a la BD
import{AngularFirestore} from '@angular/fire/firestore';


//importamos la interface
import {RegistrosI} from 'src/app/models/registros.interface';


@Injectable({
  providedIn: 'root'
})
export class RegistrosService {

  //inyectamos el servicio a la bd
  constructor(private readonly firestore:AngularFirestore) { 
  }

  //--------------------------------------------
  // conecion y manejo de base de datos tomado de:
  // https://medium.com/angular-chile/angular-6-y-firestore-b7f270adcc96
  //--------------------------------------------
 //metodos

 //Recibe un objeto de la interface
  crearRegistro(registro: RegistrosI)
  {
    return this.firestore.collection('registros').add(registro);
    
  }
   //Recibe el id para un obtener un unico registro
  getRegistro(registroId: string) {
    return this.firestore.collection('registros').doc(registroId).snapshotChanges();
  }

  //obtiene todos los registros
  getRegistros()
  {
    return this.firestore.collection('registros').snapshotChanges();
  }

  //actualiza un registro
  public updateRegistro(documentId: string, registro: RegistrosI) {
    return this.firestore.collection('cats').doc(documentId).set(registro);
  }
  //elimina un registro
  eliminarRegistro(registroID: string){

    return this.firestore.doc('registros/' + registroID).delete();;
  }

}






