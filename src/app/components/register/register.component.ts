import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';

//Importar servicio
import { RegistrosService } from 'src/app/services/registros.service';
import { Observable } from 'rxjs';
import { RegistrosI } from 'src/app/models/registros.interface';
//inyectar service
//usar service




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent  implements OnInit {

  
  //inyectar service
  constructor( private registrosService : RegistrosService) { 

  }

  ngOnInit(): void {
    this.registrosService.getRegistros().subscribe(res => console.log(res));
  }

  //Control del email 
  emails = new FormControl('', [Validators.required, Validators.email]);

  errorEmail() {
    if (this.emails.hasError('required')) {
      return 'Debe ingresar un email';
    }
    this.rg.email='ronal@gmail.com'
    return this.emails.hasError('email') ? 'Email no válido' : '';
  }


   //devlarar una nueva "clase" u Objeto de la interface
    rg: RegistrosI = { 
    
    id:'dvzxvx',
    nombres: 'dvszvx',
    apellidos: 'cxvxv',
    cedula: 2432554,
    email: 'dfszdsf',
    fechaNacimiento:'sfsdzfsz',
    direccion: 'szfdzsfd',
    ciudad: 'zfdszdf',
    departamento:'sfdszf',
    pais: 'zdfzsf',
    codigoPostal:'zdfszf',
    profesion: 'szfdsz',
    habilidades:'sfds',
    descripcion: 'zfdsfds',
  }

  




  onRegister()
  {
    
    console.log(this.rg)

    this.registrosService.addRegistro(this.rg)
           
     
  }

  

}
