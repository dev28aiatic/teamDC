import { Component, OnInit } from '@angular/core';

//para el loguin
import { AngularFireAuth } from '@angular/fire/auth';
import { RegistrosService } from 'src/app/services/registros.service';


import { FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MunicipiosColombiaService } from 'src/app/services/municipios-colombia.service';
import { startWith, map } from 'rxjs/operators';


//para recuperar la imagen que se subio
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  //almacena el usuario logueado
  private UserEmail:string;
  // lista de registros
  public listaRegistros=[];
  //registro a modificar
  registroUsuario
  //para el formGroup
  editForm: FormGroup;
  checkboxForm :FormGroup;
  //cambiar estados de los botones
  btnEditarDisabled=false;
  btnGuardarDisabled=true;

  
  //donde se va almacenar el id de un registro
  public documentId = null;

  datosMunicipios:string[]=[];
  datosDepartamentos:string[]=[];
  
  filteredMunicipios: Observable<string[]>;
  filteredDepartamentos: Observable<string[]>;

  //para la fecha de nacimiento
  datePipe = new DatePipe('en-US');
  
  constructor(
    // para manejar el estado de la sesion
    private afAuth: AngularFireAuth,
    // para la conexion con la BD
    private registroService:RegistrosService,
    //para el formulario
    private fb:FormBuilder,
    /// servicio encargado de municipios de colombia
    private municipiosService:MunicipiosColombiaService,
    //para subir la imagen al storage de firebase
    private storage:AngularFireStorage
    
  ) {

     //crea un formgoroup para los checkBox
    this.checkboxForm= this.fb.group({
      //un array de Form
      habiForm: new FormArray([], Validators.required)});
  
    this.editForm= this.fb.group({

      photoUrl: new FormControl(''),
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      cedula: new FormControl('', [Validators.required, this.validarCedula]),
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


  //para la imagen basado en https://dev.to/fayvik/uploading-an-image-to-firebase-cloud-storage-with-angular-2aeh
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  urlImage;
  

  ngOnInit(): void {

    this.getDatosMuniYDeap();
         

    this.UserEmail=this.afAuth.auth.currentUser.email;


    this.editForm.setValue({
      photoUrl:'',
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

  }


  //metodo para subir la imagen al storage
  onUpload(e){
    //console.log('subir', e);
    //generar un id unico para la imagen
    const id = Math.random().toString(36).substring(2);
    //aqui se tiene el archivo
    const file = e.target.files[0];
    
    const filePath = `uploads/profile_${id}`;
    //ruta del fichero
    const ref = this.storage.ref(filePath);
    //se realiza la subida del fichero
    const task = this.storage.upload(filePath,file);

    this.uploadPercent = task.percentageChanges();
    //para recuperar la url
    task.snapshotChanges()
    .pipe(
      finalize(() => {
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.urlImage = url;
            this.editForm.enable();
            this.editForm.controls.photoUrl.setValue([this.urlImage]);            
            this.editForm.controls.fechaNacimiento.setValue(this.registroUsuario.data.fechaNacimiento);
            this.onUpdate(this.editForm.value);

          }
          console.log(this.urlImage);
        });
      })
    ).subscribe();
}



    


 
  
  //metodo para informar errores en el campo de cedula
  errorCedula() {
    if (this.editForm.controls.cedula.hasError('required')) {
      return 'Ingrese un número de cédula';
    }
    if (this.editForm.controls.cedula.hasError('ms')) {
      return 'El número de cedula ya ha sido registrado';
    }
    
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

    //console.log( this.registroUsuario.id );
    //console.log('sdsadadas');
    //console.log( this.documentId );
      //para el id del documento a actualizar
      this.documentId = this.registroUsuario.id;

      let editSubscribe = this.registroService.getRegistro(this.documentId).subscribe((registro) => {
       
      
     
        let myFormattedDate = this.datePipe.transform(registro.payload.data()['fechaNacimiento']*1000, 'dd/MM/yyyy');
       
       
       
        
        

        this.editForm.setValue({  
          
          photoUrl:registro.payload.data()['photoUrl'],
          nombres: registro.payload.data()['nombres'],
          apellidos: registro.payload.data()['apellidos'],
          cedula: registro.payload.data()['cedula'],
          email: registro.payload.data()['email'],
          fechaNacimiento: /*registro.payload.data()['fechaNacimiento'],*/myFormattedDate,
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
    this.editForm.controls.habilidades.setValue([]);
    this.editForm.controls.habilidades.setValidators([Validators.required]);
    this.editForm.controls.habilidades.updateValueAndValidity();
    this.editForm.controls.fechaNacimiento.setValue([]);
    this.editForm.controls.fechaNacimiento.setValidators([Validators.required]);
    this.editForm.controls.fechaNacimiento.updateValueAndValidity();
    
    this.nHabilidaddes=0;
      const habiForm: FormArray = this.checkboxForm.get('habiForm') as FormArray;
        let i=2;
        while (habiForm.controls.length!=0) {
          habiForm.removeAt(i);
          i--;
        }

    //this.checkboxForm.controls.habiForm
    console.log(this.checkboxForm.controls.habiForm);
  }

  onUpdate(form){

    this.editForm.get('email').enable();
    this.editForm.controls.email.setValue(this.UserEmail);
    //verifica el resultado del metodo verificar existencia de correo 
    if (this.ValidarExistenciaCorreo(this.editForm.get('email').value)  == false && 
        this.ValidarExistenciaCedula(this.editForm.get('cedula').value) == false ) 
    {
      
   
      

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
  //Conteno de habilidades
  nHabilidaddes:number=0;

 

  onCheckboxChange(e) {
    const habiForm: FormArray = this.checkboxForm.get('habiForm') as FormArray;
        
    //si lo chuliaron hagrega al array siempre que numero de habilidades menor 4
    if (e.checked && this.nHabilidaddes<=2) {
      
      habiForm.push(new FormControl(e.source.value));        
      this.nHabilidaddes++;
      this.validarHabilidades();
    } else {

      //si numero la habilidad se desmarca elimina habilidad 
      if(e.checked==false)
      {
        const index = habiForm.controls.findIndex(x => x.value === e.source.value);
        habiForm.removeAt(index);
        this.validarHabilidades();
        this.nHabilidaddes--;
      }
      //si numero de habilidades esta al limite (3) no agrega nada y no permite chulear
      else{
        e.source._checked=false;
      }
    }

    //si no hay habilidades selecionadas no habilita el boton
    if(this.nHabilidaddes==0)
    {
      this.editForm.controls.habilidades.setValue([]);
      this.editForm.controls.habilidades.setValidators([Validators.required]);
      this.editForm.controls.habilidades.updateValueAndValidity();
  }
    
  //console.log(this.editForm.controls.habilidades.value);

  }

  // para asignar las habilidades al Formgroup principal
  validarHabilidades(){
    //obtengo los valores de FormGroup
    const ob = this.checkboxForm.value;

    //obtengo el array habForm de ob ostenido de FormGroup
    const { habiForm } = ob;

    //para almacenar las habilidades
    let habilidadesIn: string = '';    

    for (let i = 0; i < habiForm.length; i++) {

      habilidadesIn += habiForm[i] + " / "; // \n 

    }         
    //asigno las habilidaesIn al valor del formcontrol habilidaes para que lo registre en la bd  
    this.editForm.controls.habilidades.setValue([habilidadesIn]);

  }



  
  _filterMunicipios(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.datosMunicipios.filter(option => option.toLowerCase().includes(filterValue));
  }

  
  _filterDepartamentos(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.datosDepartamentos.filter(option => option.toLowerCase().includes(filterValue));
  }

  getDatosMuniYDeap(){

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

    

  

  
    this.filteredMunicipios = this.editForm.controls.ciudad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterMunicipios(value))
      );


    this.filteredDepartamentos = this.editForm.controls.departamento.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterDepartamentos(value))
    );


  }

}
