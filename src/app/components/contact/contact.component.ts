import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  //para el formGroup
  contactForm: FormGroup;

  constructor(
    //para el formulario
    private fb:FormBuilder
  ) {

    this.contactForm= this.fb.group({

      nombreCompleto: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, /*this.validarEmail*/]),
      motivo: new FormControl('', [Validators.required]),
      mensaje: new FormControl('', [Validators.required]),

    });

   }

  ngOnInit(): void {

    this.contactForm.setValue({

      nombreCompleto: '', 
      email: '', 
      motivo: '',
      mensaje: ''

    });

  }

  oncreate(form){

  }
}
