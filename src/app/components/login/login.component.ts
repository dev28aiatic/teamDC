import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { AuthService } from '../../services/auth.service';
import { RegistrosService } from 'src/app/services/registros.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[AuthService],
})
export class LoginComponent implements OnInit {
 
  loginForm= new FormGroup({
    
    email: new FormControl('',[Validators.required, Validators.email]),

  })
  resDialog: any;

  
  constructor(private authSvc:AuthService, private router: Router, 
    private registroService:RegistrosService,
    private matDialog: MatDialog,
    public afAuth: AngularFireAuth) { }

  
  listaRegistros;

  
     
  ngOnInit(): void {
    this.registroService.getRegistros().subscribe((rgSnapshot) => {
      this.listaRegistros = [];
      rgSnapshot.forEach((rgData: any) => {
        this.listaRegistros.push({
          id: rgData.payload.doc.id,
          data: rgData.payload.doc.data()

        });
      })
    });
  }
  
    
   

 async onLogin(){
    console.log("funciona"+ this.loginForm.controls.email.value);
    
    if(this.ValidarExistenciaCorreo(this.loginForm.controls.email.value)==true)
    {
      const user= await this.authSvc.login(this.loginForm.controls.email.value,
        this.loginForm.controls.email.value);
     if (user) {
       //redirect to homePage
       this.router.navigate(['/home'])
     }
     
       
       }
    else{
      //window.alert('correo no registrado');
      const data={ titulo:'Advertencia', mensaje:'El correo no esta registrado en la BD'};
      this.openDialog(data);
      
    }


  }
  get email(){ return this.loginForm.get('email');}
  get password(){ return this.loginForm.get('password');}


 //Valida la existencia del correo en la bd, retorna un boolean

 ValidarExistenciaCorreo(correo: string): boolean {
   console.log("validacion"+correo)
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

 
    respuesta = true;

  }
  else {
    respuesta = false;
  }

  return respuesta;

}

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
}
