import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';

//Importar servicio
import { RegistrosService } from 'src/app/services/registros.service';
//inyectar service
//usar service

//importamos la interface
import {RegistrosI} from 'src/app/models/registros.interface';




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

  
  

    registerForm = new FormGroup({ 
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

  //para obtener datos individuales
  //this.registerForm.get('nombres').value


 
  
  async onRegister(){

    //this.registrosService.addRegistro(this.registerForm.value);
   
  }





  

  

  errorEmail() {
    if (this.registerForm.controls.email.hasError('required')) {
      return 'Debe ingresar un email';
    }
    
    return this.registerForm.controls.email.hasError('email') ? 'Email no válido' : '';
  }

/*
   //devlarar una nueva "clase" u Objeto de la interface
    rg: RegistrosI = { 
    
    id:'dvzxvy',
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
*/
  



  

  

}
