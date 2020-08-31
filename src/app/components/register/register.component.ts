import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, AbstractControl, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';

//Importar servicio encargada de ls bd
import { RegistrosService } from 'src/app/services/registros.service';

//Importar servici encargada de los municipios de colombia
import {MunicipiosColombiaService} from 'src/app/services/municipios-colombia.service'


import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  //donde se van a almacenar los registros de la bd
  public listaRegistros=[];
  
  
  datosMunicipios:string[]=[];
  datosDepartamentos:string[]=[];
  

//respuesta del Dialog
   resDialog:boolean=false;
  //para el autocompletar
 
  filteredMunicipios: Observable<string[]>;
  filteredDepartamentos: Observable<string[]>;


  //donde se va almacenar el id de un registro
  public documentId = null;

  //Si el valor es 1, la aplicación estará en modo creación si es 2 se habilita el modo edicion
  public currentStatus = 1;

  registerForm: FormGroup;

  //inyectar el servicio rgistros servis encargada de la bd 
  constructor( private registrosServiceF : RegistrosService,
    /// servicio encargado de municipios de colombia
     private municipiosService:MunicipiosColombiaService,
     //inyecto el modal o ventana emergente
     private matDialog: MatDialog,
     //para navegacion
     private router:Router,
     //para el formbuilder
     private fb:FormBuilder


    ) { 

      this.registerForm= this.fb.group({

      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      cedula: new FormControl('', [Validators.required, this.validarCedula]),
      email: new FormControl('', [Validators.required, Validators.email, this.validarEmail]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      ciudad: new FormControl('', [Validators.required]),
      departamento: new FormControl('', [Validators.required]),
      pais: new FormControl('', [Validators.required]),
      codigoPostal: new FormControl('', [Validators.required]),
      profesion: new FormControl('', [Validators.required]),
      habilidades: new FormControl(''),
      descripcion: new FormControl('', [Validators.required]),

      })

    //asigna los valores al formulario como vacios
    this.registerForm.setValue({

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

  }


  ngOnInit() {
    //obtiene todos los registros de la bd
    this.registrosServiceF.getRegistros().subscribe((rgSnapshot) => {
      this.listaRegistros = [];
      rgSnapshot.forEach((rgData: any) => {
        this.listaRegistros.push({
          id: rgData.payload.doc.id,
          data: rgData.payload.doc.data()
                             
        });
      })
    });

       
    //obtengo los datos del service de departamentos y municipios
    this.municipiosService.getDatos().subscribe(datos =>{
      
      //almaceno todos los municipios
      this.datosMunicipios=datos.map(data=> 
        // del map retorna algo
        data.municipio);

        this.datosDepartamentos=datos.map(data=> 
          // del map retorna algo
          data.departamento);


        //elimino los departamentos repetidos
        let NuevosDatosDepartamentos:string[]=[];

        for (let posicion = 0; posicion < this.datosDepartamentos.length; posicion++) {
          const element = this.datosDepartamentos[posicion];
          
          if(posicion==0)
          {
            NuevosDatosDepartamentos.push(element.toString());
          }
          else{
            if(NuevosDatosDepartamentos.includes(element.toString())==false)
            {
              NuevosDatosDepartamentos.push(element.toString());
            }
          }
        }
           
        this.datosDepartamentos=NuevosDatosDepartamentos; 
    });

    

  

  
    this.filteredMunicipios = this.registerForm.controls.ciudad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterMunicipios(value))
      );


    this.filteredDepartamentos = this.registerForm.controls.departamento.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDepartamentos(value))
    );

  }


  //para requerimientos personalizados
  //para el correo

  private validarEmail: ValidatorFn =(control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    let respuesta= null;
    if (this.ValidarExistenciaCorreo(email)==true) {
      return{ ms: 'para otro forma de error' };
    }
    
    return null;
  }
    

  //metodo para informar errores en el campo de email
  errorEmail() {
    if (this.registerForm.controls.email.hasError('required')) {
      return 'Debe ingresar un email';
    }
    if (this.registerForm.controls.email.hasError('ms')) {
      return 'El email ya ha sido registrado';
    }
    return this.registerForm.controls.email.hasError('email') ? 'Email no válido' : '';
  }

  
    //para la cedula
  
    private validarCedula: ValidatorFn =(control: AbstractControl): ValidationErrors | null => {
      const cedula = control.value;
      let respuesta= null;
      if (this.ValidarExistenciaCedula(cedula)==true) {
        return{ ms: 'para otro forma de error' };
      }
      
      return null;
    }
      
  
    //metodo para informar errores en el campo de cedula
    errorCedula() {
      if (this.registerForm.controls.cedula.hasError('required')) {
        return 'Ingrese un número de cédula';
      }
      if (this.registerForm.controls.cedula.hasError('ms')) {
        return 'El número de cedula ya ha sido registrado';
      }
      
    }
  
    
    
  //abrir dialogo
  openDialog(data:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    //dialogConfig.data = { titulo:'Estado de registro', mensaje:'Exitoso'};
    let dialogRef = this.matDialog.open(DialogComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(value => {
      this.resDialog=value;
      console.log(`Dialog sent: ${value}`); 
    });;
  }
  


  _filterMunicipios(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.datosMunicipios.filter(option => option.toLowerCase().includes(filterValue));
  }

  
  _filterDepartamentos(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.datosDepartamentos.filter(option => option.toLowerCase().includes(filterValue));
  }


  //para el modal o ventana emergente
    
 

 

  //para hacer un nuevo registro en la bd

  public onRegister(form, documentId = this.documentId) {

    
    //verifica el resultado del metodo verificar existencia de correo y que solo sean 3 habilidades
    if (this.ValidarExistenciaCorreo(this.registerForm.get('email').value)  == false && 
        this.ValidarExistenciaCedula(this.registerForm.get('cedula').value) == false && this.validarHabilidades() == true) {

      console.log(`Status: ${this.currentStatus}`);


    

      //si es 1 es para la creacion de un nuevo registro
      if (this.currentStatus == 1) {

        console.log("creacion: " + this.registerForm.get('email').value)
        console.log("creacion: " + this.registerForm.get('cedula').value)

        this.registrosServiceF.crearRegistro(this.registerForm.value).then(() => {

          //si se aprobo el registro
          const data={ titulo:'Estado del registro', mensaje:'Exitoso, gracias por registrarte'};
          this.openDialog(data);

        
          
            console.log("respuesta del dialogo:"+this.resDialog);
            this.router.navigate(['/home']);
          

          //limpia el formulario
          this.registerForm.setValue({

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
        }, (error) => {
          console.error(error);
        });
        
      }
    } else {
      
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
        fechaNacimiento: registro.payload.data()['fechaNacimiento'],
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

  //elimina el registro de la bd
  public eliminarRegistro(documentId) {
    this.registrosServiceF.eliminarRegistro(documentId).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

 
 //Valida la existencia del correoen la bd, retorna un boolean
 
  ValidarExistenciaCorreo(correo: string): boolean {
    let existeCorreo: boolean = false;
    let respuesta: boolean = true;


    //Obtengo los correos en un array
    for (let i = 0; i < this.listaRegistros.length; i++) {
      const element = this.listaRegistros[i];

      const { email } = element.data;
      if (correo == email) {
        existeCorreo = true;
      }
      
    }


    if (existeCorreo == true) {

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
      if (cedulaIn == cedula) {
        existeCedula = true;
      }

      
    }
    if (existeCedula == true) {
      
      //const data={ titulo:'Advertencia', mensaje:'La cedula ingresada ya está registrada'};
      //this.openDialog(data);
      respuesta = true;
    }   
    else {
      respuesta = false;
    }

    return respuesta;

  }
  

  // para el checkbox empleando *ngFor en el html

  listaHabi: any = [
    { id: 1, name: 'Autoconocimiento' },
    { id: 2, name: 'Empatía' },
    { id: 3, name: 'Comunicación asertiva' },
    { id: 4, name: 'Pensamiento crítico' },
    { id: 5, name: 'Toma de decisiones' },
    { id: 6, name: 'Adaptación' },
    { id: 7, name: 'Comunicación' },
    { id: 8, name: 'Trabajo en equipo' },
    { id: 9, name: 'Capacidad de asociación' },
    { id: 10, name: 'Razonamiento' },
  ];

  //crea un formgoroup para los checkBox
  checkboxForm = new FormGroup({

    //un array de Form
    habiForm: new FormArray([], Validators.required)

  });


  onCheckboxChange(e) {
    const habiForm: FormArray = this.checkboxForm.get('habiForm') as FormArray;

    //si lo chuliaron hagrega al array si no lo elimina
    if (e.target.checked) {
      habiForm.push(new FormControl(e.target.value));
    } else {
      const index = habiForm.controls.findIndex(x => x.value === e.target.value);
      habiForm.removeAt(index);
    }
  }

  // para validar que sean 3 habilidaddes
  validarHabilidades(): boolean {

    //obtengo los valores de FormGroup
    const ob = this.checkboxForm.value;

    //obtengo el array habForm de ob ostenido de FormGroup
    const { habiForm } = ob;

    //para almacenar las habilidades
    let habilidadesIn: string = '';
    //un indicador si selecciono 3 habilidades
    let selc3: boolean = false;

    if (habiForm.length > 3 || habiForm.length == 0) {
      const data={ titulo:'Advertencia', mensaje:'Solo puede seleccionar 3 habilidades'};
      this.openDialog(data);


    } else {

      for (let i = 0; i < habiForm.length; i++) {

        habilidadesIn += habiForm[i] + " / "; // \n 

      }
      selc3 = true;
    }
    //asigno las habilidaesIn al valor del formcontrol habilidaes para que lo registre en la bd  
    this.registerForm.controls.habilidades.setValue([habilidadesIn]);


    if (selc3 == true) {
      return true;
    } else {
      return false;
    }

  }
}

