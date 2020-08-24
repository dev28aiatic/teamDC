import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

//Importar servicio
import {RegistrosService} from 'src/app/services/registros.service';
//inyectar service
//usar service




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {




  //Control del email 
  email = new FormControl('', [Validators.required, Validators.email]);

  errorEmail() {
    if (this.email.hasError('required')) {
      return 'Debe ingresar un email';
    }

    return this.email.hasError('email') ? 'Email no válido' : '';
  }

  
  //inyectar service
  constructor( private registrosService:RegistrosService) { }

  ngOnInit(): void {
    this.registrosService.getRegistros().subscribe(res => console.log(res));
  }

}
