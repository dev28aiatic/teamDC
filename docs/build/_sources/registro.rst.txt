*********
Registro
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

    En el método ngOnInit también se declara un array observador para municipio y otro para departamento
    encargado del filtrado en el componente html. 
    ::
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

    Al mismo tiempo se realiza a los métodos que devuelve un array con las filtraciones realizadas
    ::
        _filterMunicipios(value: string): string[] {
            const filterValue = value.toLowerCase();
            return this.datosMunicipios.filter(option => option.toLowerCase().includes(filterValue));
        }

        _filterDepartamentos(value: string): string[] {
            const filterValue = value.toLowerCase();
            return this.datosDepartamentos.filter(option => option.toLowerCase().includes(filterValue));
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

    Otro de los campos con funciones especiales son los de municipio y departamento que emplean un filtro
    de autocompletado y su estructura en HTML es el siguiente aplicable para los dos
    casos cambiando su contenido.
    ::
        <mat-form-field appearance="outline">
            <mat-label>Ciudad</mat-label>
            <input type="text" aria-label="Number" matInput formControlName="ciudad" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete">
                <mat-option *ngFor="let municipio of filteredMunicipios | async" [value]="municipio">
                    {{municipio}}
                </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="registerForm.controls.ciudad.invalid">Ingrese una ciudad</mat-error>
        </mat-form-field>

    El formulario incluía una sesión donde se debía ingresar de 1 a 3 habilidades mediante checkbox,
    para ello se declaró e inicializo un array con las habilidades preestablecida y un contador de habilidades.
    ::
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
        nHabilidaddes:number=0;
    
    Para el control y majeo de los checkbox se creó un formGoup con un array de forms
    ::  
        checkboxForm = new FormGroup({    
            habiForm: new FormArray([], Validators.required)
        });

    El campo de los checkbox  en el HTML es el siguiente.
    :: 
        <form [formGroup]="checkboxForm">
            <table id="tbl-habilidades">
                <section class="section">
                    <ul >
                        <li *ngFor="let hab of listaHabi">
                        <   mat-checkbox class="example-margin" [value]="hab.name" (change)="onCheckboxChange($event)">{{hab.name}}</mat-checkbox>
                        </li>
                    </ul>              
                </section>
            </table>
            <p></p>           
        </form>
    
    Cada vez que un checkbox sea seleccionado o cambie su estado se ejecuta el siguiente método que 
    obtiene el array de forms y se comprueba si ha sido seleccionado y  el contador de 
    habilidades esta en el rango entre 1 y 3 se suma el formContro al array de forms y 
    se suma el contador de habilidades, si contador de habilidades llega al límite entonces
    si el checkbox seleccionado es des marcado se elimina  ese formControl del array de forms de 
    lo contrario no permitirá seleccionar más checkbox.

    Si el contador de habilidades vuelve a ser 0 por deseleccionar todas las habilidades el 
    fromControl principal es limpiado y actualizado su validador de requerido inhabilitando 
    el botón de enviar el formulario. 
    ::
        onCheckboxChange(e) {
            const habiForm: FormArray = this.checkboxForm.get('habiForm') as FormArray;                
            //si lo chuliaron agrega al array siempre que numero de habilidades sea menor 3
            if (e.checked && this.nHabilidaddes<=2) {            
                habiForm.push(new FormControl(e.source.value));        
                this.nHabilidaddes++;
                //metodo que actuliza las habilidades con el formControl principal
                this.validarHabilidades();
            } else {
            //si numero la habilidad se desmarca elimina habilidad 
            if(e.checked==false)
            {
                const index = habiForm.controls.findIndex(x => x.value === e.source.value);
                habiForm.removeAt(index);
                //metodo que actuliza las habilidades con el formControl principal
                this.validarHabilidades();
                this.nHabilidaddes--;
            }
            //si numero de habilidades esta al limite (3) no agrega nada y no permite chulear
            else{
                e.source._checked=false;
            }
            }

            //si no hay habilidades selecionadas no habilita el boton de registrarse
            if(this.nHabilidaddes==0)
            {
                //restauro el formControl principal, limpiandolo, agregando el validador y actualizandolo
                this.registerForm.controls.habilidades.setValue([]);
                this.registerForm.controls.habilidades.setValidators([Validators.required]);
                this.registerForm.controls.habilidades.updateValueAndValidity();
            }            
            //console.log(this.registerForm.controls.habilidades.value);
        }
    
    El método validarHabilidades() llamado internamente cuando un checkbox cambia su estado es 
    el encargado de obtener el valor de la habilidad y asignarlo al formControl principal de 
    habilidades del cual se tomara su valor parar registrarlo en la base de datos.
    ::        
        validarHabilidades(){

            //obtengo los valores de FormGroup
            const ob = this.checkboxForm.value;
            //obtengo el array habForm de ob ostenido de FormGroup
            const { habiForm } = ob;

            //para almacenar las habilidades
            let habilidadesIn: string = '';    

            for (let i = 0; i < habiForm.length; i++) {

                habilidadesIn += habiForm[i] + " / ";  

            }         
            //asigno las habilidaesIn al valor del formcontrol habilidaes para que lo registre en la bd  
            this.registerForm.controls.habilidades.setValue([habilidadesIn]);
        }

    Para registrar en la base de datos se emplea el siguiente método donde hace otra verificación sobre la cedula y 
    el email que es redundante dado que ya se validó, se le asigna una foto al formControl photoUrl por 
    defecto para su perfil y se procede a realizar el registro en la base de datos, también se muestra 
    un modal agradeciendo el registro y se redirige a la vista de inicio.

    Al momento hacer el registro también se crea un usuario en el sistema mediante su email, siendo este de email y 
    contraseña con el cual tendrá acceso al sistema.
    ::               
        public onRegister(form, documentId = this.documentId) {

            //verifica el resultado del metodo verificar existencia de correo
            if (this.ValidarExistenciaCorreo(this.registerForm.get('email').value)  == false && 
                this.ValidarExistenciaCedula(this.registerForm.get('cedula').value) == false ) 
            {
                // se le asigan una foto por defecto
                this.registerForm.controls.photoUrl.setValue("https://firebasestorage.googleapis.com/v0/b/teamdc-c1083.appspot.com/o/uploads%2FLogo.png?alt=media&token=4c51f16d-bb24-4845-9961-b8145ce65a1b");
                // se realiza el registro en la bd
                this.registrosServiceF.crearRegistro(this.registerForm.value).then(() => {

                //se presenta un modal
                const data={mensaje:'Gracias por registrarte'};
                this.openDialog(data);    
                //se redirige a la pagina home
                this.router.navigate(['/home']);
                
                }, (error) => {
                console.error(error);
                });        
                
                const result= this.afAuth.auth.createUserWithEmailAndPassword(
                this.registerForm.controls.email.value, 
                this.registerForm.controls.email.value);

            
            }
        }|











