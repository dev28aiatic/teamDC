import { Injectable } from '@angular/core';

//importaciones para gestionar el servicio a la BD
import{AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

//importamos complementos
import {Observable}  from 'rxjs';
import {map} from 'rxjs/operators';

//importamos la interface
import {RegistrosI} from 'src/app/models/registros.interface';

//para obtener id 
//export  interface RegistrosID extends RegistrosI {id:string;}


@Injectable({
  providedIn: 'root'
})
export class RegistrosService {

  //Propiedadess
  private registrosCollection: AngularFirestoreCollection<RegistrosI>;

  //listado de registros
  registros: Observable<RegistrosI[]>;

  // para llamarlo desde el formulario
  public seleccionado ={
    
    id: null,
    nombres: '',
    apellidos: '',
    cedula: null,
    email: '',
    fechaNacimiento: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: '',
    codigoPostal:'',
    profesion: '',
    habilidades:'',
    descripcion:'',
  }

  constructor(private readonly angularFirestore:AngularFirestore) { 

    /// para obtener todos los datos de la BD
    this.registrosCollection= angularFirestore.collection<RegistrosI>('registros');
    this.registros = this.registrosCollection.snapshotChanges().pipe(

      map(actions =>actions.map(a => {
        const datos =a.payload.doc.data() as RegistrosI;
        const id = a.payload.doc.id;
        return {id, ...datos}; 
      }))
    );
    

  }


  //metodos

  //Obtiene todos los registros
  getRegistros()
  {
    return this.registros;
  }

  //editar registro
  editarRegistro(registro:RegistrosI){
 
    return this.registrosCollection.doc(registro.id).update(registro);
  }

  //borrar registro
  borrarRegistro(id:string){
    return this.registrosCollection.doc(id).delete();
  }

  //crear nuevo registro
  addRegistro(registro:RegistrosI){

    return this.registrosCollection.add(registro);

  }

  

  

  /*
  //Crea un nuevo gato
  public createCat(data: {nombre: string, url: string}) {
    return this.firestore.collection('cats').add(data);
  }
  //Obtiene un gato
  public getCat(documentId: string) {
    return this.firestore.collection('cats').doc(documentId).snapshotChanges();
  }
  //Obtiene todos los gatos
  public getCats() {
    return this.firestore.collection('cats').snapshotChanges();
  }
  //Actualiza un gato
  public updateCat(documentId: string, data: any) {
    return this.firestore.collection('cats').doc(documentId).set(data);
  }
  */
}






