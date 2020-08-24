import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    cedula: new FormControl(''),
    email: new FormControl(''),
    nacimiento: new FormControl(''),
    direccion: new FormControl(''),
    ciudad: new FormControl(''),
    departamento: new FormControl(''),
    pais: new FormControl(''),
    postal: new FormControl(''),
    profesion: new FormControl(''),
    habilidades: new FormControl(''),
    descripcion: new FormControl(''),
  })

  async onRegister() { }

  //Control del email 
  email = new FormControl('', [Validators.required, Validators.email]);

  errorEmail() {
    if (this.email.hasError('required')) {
      return 'Debe ingresar un email';
    }

    return this.email.hasError('email') ? 'Email no válido' : '';
  }

  

  constructor() { }

  ngOnInit(): void {
  }

}
