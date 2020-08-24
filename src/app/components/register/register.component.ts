import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';


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

  

 




  
  constructor() { }

  ngOnInit(): void {
  }

}
