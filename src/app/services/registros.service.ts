import { Injectable } from '@angular/core';

//importaciones para gestionar el servicio a la BD
import{AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';



//importamos la interface
import {RegistrosI} from 'src/app/models/registros.interface';

//ID para la interface
export interface RegistrosID extends RegistrosI{id:string;}


@Injectable({
  providedIn: 'root'
})
export class RegistrosService {


  //Crear propiedad
  private registrosCollection: AngularFirestoreCollection<RegistrosI>;

  //propiedad para guardar todos los usuarios
  registros: Observable<RegistrosID[]>;

  //inyectamos el servicio a la bd
  constructor(private readonly firestore:AngularFirestore) { 

    
    //nombre de la coleccion va en parentesis
    this.registrosCollection = firestore.collection<RegistrosI>('registros');
    this.registros = this.registrosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a =>{
        const data = a.payload.doc.data() as RegistrosI;
        const id = a.payload.doc.id;
        return{ id, ...data};
      }))
    );
  }

 

  getAllUser(){
    //return todos los usuarios
    return this.registros;
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






