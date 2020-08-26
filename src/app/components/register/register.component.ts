import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';

//Importar servicio
import { RegistrosService } from 'src/app/services/registros.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent  implements OnInit {

  //donde se van a almacenar los registros de la bd
  public listaRegistros=[];
  public listacorreos=[];

  //donde se va almacenar el id de un registro
  public documentId = null;

  //Si el valor es 1, la aplicación estará en modo creación si es 2 se habilita el modo edicion
  public currentStatus = 1;

  //para el manejo del formulario
  public registerForm = new FormGroup({ 
    
    nombres:new FormControl(''),
    apellidos:new FormControl(''),
    cedula:new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    fechaNacimiento:new FormControl(''),
    direccion: new FormControl(''),
    ciudad: new FormControl(''),
    departamento:new FormControl(''),
    pais: new FormControl(''),
    codigoPostal:new FormControl(''),
    profesion: new FormControl(''),
    habilidades:new FormControl(''),
    descripcion: new FormControl(''),

  });

  
  //metodo para control del formulario
  errorEmail() {
    if (this.registerForm.controls.email.hasError('required')) {
      return 'Debe ingresar un email';
    }
    
    return this.registerForm.controls.email.hasError('email') ? 'Email no válido' : '';
  }


  //inyectar el service 
  constructor( private registrosServiceF : RegistrosService) { 

    //asigna los valores al formulario como vacios
    this.registerForm.setValue({
     
      nombres: '',
      apellidos: '',
      cedula: null,
      email: '',
      fechaNacimiento:'',
      direccion: '',
      ciudad: '',
      departamento:'',
      pais: '',
      codigoPostal:'',
      profesion: '',
      habilidades:'',
      descripcion: '',
    });

  }

  
  ngOnInit() {
    //obtine todos los registros de la bd
    this.registrosServiceF.getRegistros().subscribe((rgSnapshot) => {
      this.listaRegistros = [];
      rgSnapshot.forEach((rgData: any) => {
        this.listaRegistros.push({
          id: rgData.payload.doc.id,
          data: rgData.payload.doc.data()
        });
      })
    });
  }


  //para registrar un nuevo registro en la bd
  
  public onRegister(form, documentId = this.documentId){    
      
    //verifia el resultado del metodo verificar existencia de correo
    if(this.ValidarExistenciaCorreo(this.registerForm.get('email').value)==false)
    {
      
      console.log(`Status: ${this.currentStatus}`);

      //si es 1 es para la creacion de un nuevo registro
      if (this.currentStatus == 1) {

        console.log("creacion: "+this.registerForm.get('email').value)

        this.registrosServiceF.crearRegistro(this.registerForm.value).then(() => {
          console.log('Documento creado exitósamente!');
          //limpia el formulario
            this.registerForm.setValue({
                        
              nombres: '',
              apellidos: '',
              cedula: null,
              email: '',
              fechaNacimiento:'',
              direccion: '',
              ciudad: '',
              departamento:'',
              pais: '',
              codigoPostal:'',
              profesion: '',
              habilidades:'',
              descripcion: '',

            });
          }, (error) => {
          console.error(error);
        });

              
      } 
    }else{
      console.log("No se puede crear registro porque ya exixte el mismo email en la BD");
    }
    
    

    if (this.currentStatus != 1) {
        
      //modo edicion => no funciona porque falta formulario de edicion
      this.registrosServiceF.updateRegistro(documentId, this.registerForm.value).then(() => {
        this.currentStatus = 1;
        //limpia el formulario
        this.registerForm.setValue({
                      
          nombres: '',
          apellidos: '',
          cedula: null,
          email: '',
          fechaNacimiento:'',
          direccion: '',
          ciudad: '',
          departamento:'',
          pais: '',
          codigoPostal:'',
          profesion: '',
          habilidades:'',
          descripcion: '',

        });
        console.log('Documento editado exitósamente');
      }, 
      (error) => {
        console.log(error);
      });
    }
    
   
  }

  //para la edicion de un registro aun no funciona porque no hay fromulario de edicion
  public editarRegistro(documentId) {
    let editSubscribe = this.registrosServiceF.getRegistro(documentId).subscribe((registro) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.registerForm.setValue({

        id: documentId,
        nombre: registro.payload.data()['nombre'],
        apellidos: registro.payload.data()['apellidos'],
        cedula: registro.payload.data()['cedula'],
        email: registro.payload.data()['email'],
        fechaNacimiento:registro.payload.data()['fechaNacimiento'],
        direccion: registro.payload.data()['direccion'],
        ciudad: registro.payload.data()['ciudad'],
        departamento:registro.payload.data()['departamento'],
        pais: registro.payload.data()['pais'],
        codigoPostal:registro.payload.data()['codigoPostal'],
        profesion: registro.payload.data()['profesion'],
        habilidades:registro.payload.data()['habilidades'],
        descripcion: registro.payload.data()['descripcion'],
      });
      editSubscribe.unsubscribe();
    });
  }

//elimina el registro de la bd
  public eliminarRegistro(documentId) {
    this.registrosServiceF.eliminarRegistro(documentId).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

  //Valida la existencia del correo en la bd, retorna un boolean
  ValidarExistenciaCorreo(correo:string): boolean{
    
    let existe: boolean =false;

    //Obtengo los correos en un array
    for (let i = 0; i < this.listaRegistros.length; i++) {
      const element = this.listaRegistros[i];
      
      const {email}=element.data;     
      if(correo ==email)
      {
        existe=true;
      }

      //this.listacorreos.push(email);
      //console.log("rg : "+i+" => "+this.listacorreos[i]);
    }

            
    if(existe==true)
    {
      return true;
    }else{
    return false;
    }
  }

}
