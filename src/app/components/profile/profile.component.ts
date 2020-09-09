import { Component, OnInit } from '@angular/core';

//para el loguin
import { AngularFireAuth } from '@angular/fire/auth';
import { RegistrosService } from 'src/app/services/registros.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  //almacena el usuario logueado
  private UserEmail:string;
  // lista de registros
  listaRegistros;
  //registro a modificar
  registroUsuario
  //para el formGroup
  editForm: FormGroup;
  //cambiar estados de los botones
  btnEditarDisabled=false;
  btnGuardarDisabled=true;

  //guarga el id del documento a editar
  documentId;

  constructor(
    // para manejar el estado de la sesion
    private afAuth: AngularFireAuth,
    // para la conexion con la BD
    private registroService:RegistrosService,
    //para el formulario
    private fb:FormBuilder
    
  ) {
  
    this.editForm= this.fb.group({

      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      cedula: new FormControl('', [Validators.required, /*this.validarCedula*/]),
      email: new FormControl('', [Validators.required, Validators.email, /*this.validarEmail*/]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      departamento: new FormControl('', [Validators.required]),
      pais: new FormControl('', [Validators.required]),
      codigoPostal: new FormControl('', [Validators.required]),
      profesion: new FormControl('', [Validators.required]),
      habilidades: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),

      })

  }

  ngOnInit(): void {

  
    this.UserEmail=this.afAuth.auth.currentUser.email;


    this.editForm.setValue({

      nombres: '',
      apellidos: '',
      cedula: null,
      email: '',
      fechaNacimiento: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      pais: '',
      codigoPostal: '',
      profesion: '',
      habilidades: '',
      descripcion: '',

    });
    //desactivo el formulario
    this.editForm.disable();


    this.getRegistros();
    console.log(this.UserEmail)

    

  }

 

  getRegistros(){

    this.registroService.getRegistros().subscribe((rgSnapshot) => {
      this.listaRegistros = [];
      rgSnapshot.forEach((rgData: any) => {
        this.listaRegistros.push({
          id: rgData.payload.doc.id,
          data: rgData.payload.doc.data()

        });
      })

      //console.log(this.listaRegistros);
      this.setDatosFormulario();

    });

    
  }

  setDatosFormulario(){
    
    for (let index = 0; index < this.listaRegistros.length; index++) {
      const element = this.listaRegistros[index];    
    
      const { email } = element.data;

      if(email==this.UserEmail)
      {        
        this.registroUsuario=element
               
        break;
      }      
      
    };

      //para el id del documento a actualizar
      this.documentId = this.registroUsuario.id;

      let editSubscribe = this.registroService.getRegistro(this.documentId).subscribe((registro) => {
       
        console.log(registro.payload.data());
        const datePipe = new DatePipe('en-US');
        const myFormattedDate = datePipe.transform(registro.payload.data()['fechaNacimiento'].seconds*1000, 'dd/MM/yyyy');
        console.log(myFormattedDate);
       
      

        this.editForm.setValue({
  
        
          nombres: registro.payload.data()['nombres'],
          apellidos: registro.payload.data()['apellidos'],
          cedula: registro.payload.data()['cedula'],
          email: registro.payload.data()['email'],
          fechaNacimiento: registro.payload.data()['fechaNacimiento'],//myFormattedDate,
          direccion: registro.payload.data()['direccion'],
          ciudad: registro.payload.data()['ciudad'],
          departamento: registro.payload.data()['departamento'],
          pais: registro.payload.data()['pais'],
          codigoPostal: registro.payload.data()['codigoPostal'],
          profesion: registro.payload.data()['profesion'],
          habilidades: registro.payload.data()['habilidades'],
          descripcion: registro.payload.data()['descripcion'],
        });
        editSubscribe.unsubscribe();
      });
       


  }

  //boton de editar
  onEditar(){
    this.editForm.enable();
    //para no cambiar el correo
    this.editForm.get('email').disable();
    this.btnEditarDisabled=true;
  }

  onUpdate(form){


    //verifica el resultado del metodo verificar existencia de correo 
    if (this.ValidarExistenciaCorreo(this.editForm.get('email').value)  == false && 
        this.ValidarExistenciaCedula(this.editForm.get('cedula').value) == false ) 
    {
      console.log("entro a on register");
   
      this.registroService.updateRegistro(this.documentId, this.editForm.value).then(() => {
      
        this.editForm.disable();
        this.btnEditarDisabled=false;
        this.btnGuardarDisabled=true;

        //para actualizar el correo y contraseña pero esta desabilitado
        //this.afAuth.auth.currentUser.updateEmail(this.editForm.controls.email.value);
        //this.afAuth.auth.currentUser.updatePassword(this.editForm.controls.email.value);

      console.log('Documento editado exitósamente');
      }, (error) => {
        console.log(error);
      });

    }else{

      console.log(" no es valido para el registro");
      

    }


    
  }
        
  

 //Valida la existencia del correoen la bd, retorna un boolean
 
 ValidarExistenciaCorreo(correo: string): boolean {
  let existeCorreo: boolean = false;
  let respuesta: boolean = true;


  //Obtengo los correos en un array
  for (let i = 0; i < this.listaRegistros.length; i++) {
    const element = this.listaRegistros[i];

    const { email } = element.data;

    //excluyo el documento que se va a editar
    if(element.id!= this.registroUsuario.id)
    {
      if (correo == email) {
        existeCorreo = true;
      }
    }

    
    
  }


  if (existeCorreo == true) {

    console.log('El correo ingresado ya está registrado');
    //const data={ titulo:'Advertencia', mensaje:'El correo ingresado ya está registrado'};
    //this.openDialog(data);
    respuesta = true;

  }
  else {
    respuesta = false;
  }

  return respuesta;

}

//Valida la existencia del la C.C en la bd, retorna un boolean
ValidarExistenciaCedula(cedulaIn: string): boolean {

  let existeCedula: boolean = false;
  let respuesta: boolean = true;


  //Obtengo los correos en un array
  for (let i = 0; i < this.listaRegistros.length; i++) {
    const element = this.listaRegistros[i];

    const { cedula } = element.data;

    //excluyo el documento que se va a editar
    if(element.id!= this.registroUsuario.id)
    {
      if (cedulaIn == cedula) {
        existeCedula = true;
      }
    }
   

    
  }
  if (existeCedula == true) {

    console.log('La cedula ingresada ya está registrado');
    //const data={ titulo:'Advertencia', mensaje:'La cedula ingresada ya está registrada'};
    //this.openDialog(data);
    respuesta = true;
  }   
  else {
    respuesta = false;
  }

  return respuesta;

}

  
}
