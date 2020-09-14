import { Injectable } from '@angular/core';

//importaciones para gestionar el servicio a la BD
import{AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';



//importamos la interface
import {ContactosI} from 'src/app/models/registros.interface';

//ID para la interface
export interface ContactosID extends ContactosI{id:string;}

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  //Crear propiedad
  private contactosCollection: AngularFirestoreCollection<ContactosI>;

  //propiedad para guardar todos los usuarios
  contactos: Observable<ContactosID[]>;

  //inyectamos el servicio a la bd
  constructor(private readonly firestore:AngularFirestore) { 

    
    //nombre de la coleccion va en parentesis
    this.contactosCollection = firestore.collection<ContactosI>('contactos');
    this.contactos = this.contactosCollection.snapshotChanges().pipe(
      map(actions => actions.map(a =>{
        const data = a.payload.doc.data() as ContactosI;
        const id = a.payload.doc.id;
        return{ id, ...data};
      }))
    );
  }

 

  getAllUser(){
    //return todos los contactos
    return this.contactos;
  }

  //--------------------------------------------
  // conecion y manejo de base de datos tomado de:
  // https://medium.com/angular-chile/angular-6-y-firestore-b7f270adcc96
  //--------------------------------------------
 //metodos

 //Recibe un objeto de la interface
  crearContacto(contacto: ContactosI)
  {
    return this.firestore.collection('contactos').add(contacto);
    
  }


  
   //Recibe el id para un obtener un unico contacto
  getContacto(contactoId: string) {
    return this.firestore.collection('contactos').doc(contactoId).snapshotChanges();
  }

  //obtiene todos los contactos
  getContactos()
  {
    return this.firestore.collection('contactos').snapshotChanges();
  }

  //actualiza un contactos
  public updateContacto(documentId: string, contacto: ContactosI) {
    return this.firestore.collection('contactos').doc(documentId).set(contacto);
  }
  //elimina un contacto
  eliminarContacto(contactoID: string){

    return this.firestore.doc('contactos/' + contactoID).delete();;
  }

}






