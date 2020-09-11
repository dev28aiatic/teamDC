*********
Registros
*********

1. Descripción
    En este componente se debe mostrar todos los registros almacenados en la base de datos. 

2. Importaciones
    Para este componente de debe importar el servicio a la base de datos, el servicio para la 
    autentificación de usuarios y el servicio a una API para obtener los municipios y departamentos 
    de Colombia.
    ::

        import { RegistrosService } from 'src/app/services/registros.service';
        import { AngularFireAuth } from '@angular/fire/auth';
        import {MunicipiosColombiaService} from 'src/app/services/municipios-colombia.service'

    También se importan componentes de Angular Material para la implementación de ventana
    emergente o modal y de se importa el componente Router para un redireccionamiento al 
    concluir el registro.
    ::

        import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
        import { DialogComponent } from '../dialog/dialog.component';
        import { Router } from '@angular/router';

    
3. Desarrollo
    El constructor se inyectan todos los objetos a necesarios para el desarrollo del componente.
    ::
        private afAuth: AngularFireAuth,
        private registrosServiceF : RegistrosService,
        private municipiosService:MunicipiosColombiaService,
        private matDialog: MatDialog,
        private router:Router,   
        private fb:FormBuilder

    Para la captura de datos se emplea los formularios reactivos, para ello se declara un
    objeto de la clase FormGroup y se inicializa creando un FormControl para cada campo requerido, 
    declarando su estado y sus respectivo valida daciones.  
    ::
        this.registerForm= this.fb.group({
            photoUrl: new FormControl(''),      
            cedula: new FormControl('', [Validators.required, this.validarCedula]),
            .
            .
            .
            descripcion: new FormControl('', [Validators.required]),
            })

    En el método ngOnInit se realiza la obtención de todos los registros almacenados en la 
    base de datos con el fin de realizar validaciones con dichos datos, estos datos son 
    almacenados en un array.
    ::

        this.registrosServiceF.getRegistros().subscribe((rgSnapshot) => {
        this.listaRegistros = [];
        rgSnapshot.forEach((rgData: any) => {
            this.listaRegistros.push({
            id: rgData.payload.doc.id,
            data: rgData.payload.doc.data()
                                
            });
        })
        });

    En el mismo método se obtienen los datos de la API sobre los municipios y 
    departamentos de Colombia y se asignan en un array.
    ::
        
        this.municipiosService.getDatos().subscribe(datos =>{      
            // Se almacenan los municipios
            this.datosMunicipios=datos.map(data=>         
            data.municipio);
            // Se almacenan los departamentos
            this.datosDepartamentos=datos.map(data=>           
            data.departamento);

            // Se elimina los departamentos repetidos
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

    Cada campo del formulario tiene su respectivo control y todos son requeridos, ahora hay campos 
    especiales que requieren validaciones personalizadas empezando por el campo del numero de 
    cedula el cual no debe estar registrado con anterioridad en la base de datos.

    En la declaración del control de para el campo de cedula se añade su validador personalizado
    ::
        cedula: new FormControl('', [Validators.required, this.validarCedula]),
    Para la validación personalizada se crea el siguiente método.
    ::
        private validarCedula: ValidatorFn =(control: AbstractControl): ValidationErrors | null => {
            const cedula = control.value;
            let respuesta= null;
            if (this.ValidarExistenciaCedula(cedula)==true) {
            return{ ms: 'para otro forma de error' };
            }    
            return null;
        }
    Internamente este método llama a otro método encargado de revisar si la cedula ya existe 
    en los registros obtenidos de la base de datos.
    ::
        ValidarExistenciaCedula(cedulaIn: string): boolean {
            let existeCedula: boolean = false;
            let respuesta: boolean = true;
            // Se compara la cedula ingresada con la cedula de cada registro
            for (let i = 0; i < this.listaRegistros.length; i++) {
            const element = this.listaRegistros[i];
            const { cedula } = element.data;
            if (cedulaIn == cedula) {
                existeCedula = true;
            }      
            }
            if (existeCedula == true) {         
            respuesta = true;
            }   
            else {
            respuesta = false;
            }
            return respuesta;
        }

    Cuando hay la validación verifica la existencia de la cedula ingresada en los registros de 
    la base de datos, el formulario informa inmediatamente al usuario que hay un erro mediante 
    el uso de formularios reactivos y la sincronización entre la vista y el controlador.

    Campo de Cedula en el HTML
    ::
        <mat-form-field appearance="outline">
            <mat-label>Número de cédula</mat-label>
            <input matInput type="number" formControlName="cedula">            
            <mat-error *ngIf="registerForm.controls.cedula.errors">{{errorCedula()}}</mat-error>           
        </mat-form-field>

    Método encargado de informar el tipo de error.
    ::
        errorCedula() {
            if (this.registerForm.controls.cedula.hasError('required')) {
                return 'Ingrese un número de cédula';
            }
            if (this.registerForm.controls.cedula.hasError('ms')) {
                return 'El número de cedula ya ha sido registrado';
            }
        
        }

    
    El mismo comportamiento presenta el campo de Email. 

    Declaración del control email con su validador personalizado
    ::
        email: new FormControl('', [Validators.required, Validators.email, this.validarEmail]),

    Metodo para la validación personalizada.
    ::
        private validarEmail: ValidatorFn =(control: AbstractControl): ValidationErrors | null => {
            const email = control.value;
            let respuesta= null;
            if (this.ValidarExistenciaCorreo(email)==true) {
                return{ ms: 'para otro forma de error' };
            }   
            return null;
        } 
    Método encargado de revisar si el email ya existe en los registros obtenidos de la base de datos.
    ::
        ValidarExistenciaCorreo(correo: string): boolean {
            let existeCorreo: boolean = false;
            let respuesta: boolean = true;
            // Se compara el correo ingresado con el email de cada registro
            for (let i = 0; i < this.listaRegistros.length; i++) {
                const element = this.listaRegistros[i];
                const { email } = element.data;
                if (correo == email) {
                existeCorreo = true;
                }      
            }
            if (existeCorreo == true) {      
                respuesta = true;
            }
            else {
                respuesta = false;
            }
            return respuesta;
        }
    Campo de Email en el HTML
    ::
        <mat-form-field appearance="outline">
            <mat-label>E-mail</mat-label>
            <input matInput placeholder="example@example.com" formControlName="email" required>            
            <mat-error *ngIf="registerForm.controls.email.errors">{{errorEmail()}}</mat-error>
        </mat-form-field >
    Método encargado de informar el tipo de error
    ::
        errorEmail() {
            if (this.registerForm.controls.email.hasError('required')) {
                return 'Debe ingresar un email';
            }
            if (this.registerForm.controls.email.hasError('ms')) {
                return 'El email ya ha sido registrado';
            }
            return this.registerForm.controls.email.hasError('email') ? 'Email no válido' : '';
        }









