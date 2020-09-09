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
  //para el formGroup
  editForm: FormGroup;

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
        const elemetTemp=element;
        this.listaRegistros=elemetTemp;
               
        break;
      }      
      
    };

    //console.log(this.listaRegistros)
    const registro=this.listaRegistros;

    
      const currentStatus = 2;
      const documentId = this.listaRegistros.id;

      let editSubscribe = this.registroService.getRegistro(documentId).subscribe((registro) => {
       
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

  onRegister(form){
        
      }


  
}
