import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {ContactosService} from 'src/app/services/contactos.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  //para el formGroup
  contactForm: FormGroup;

  listaContactos;

  // para el selecionar le motivo
  motivos= [
    {value: 'Contratos' },
    {value: 'Proyectos'},
    {value: 'Cobranzas'}
  ];
  motivoSeleccionado:string;

  constructor(
    //para el formulario
    private fb:FormBuilder,
    private contactosService:ContactosService,
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
    this.getRegistros();
  }

  getRegistros(){

    this.contactosService.getContactos().subscribe((rgSnapshot) => {
      this.listaContactos = [];
      rgSnapshot.forEach((rgData: any) => {
        this.listaContactos.push({
          id: rgData.payload.doc.id,
          data: rgData.payload.doc.data()

        });
      })

      console.log(this.listaContactos);
      

    });

    
  }

  //metodo para informar errores en el campo de email
  errorEmail() {
    if (this.contactForm.controls.email.hasError('required')) {
      return 'Debe ingresar un email';
    }
    if (this.contactForm.controls.email.hasError('ms')) {
      return 'El email ya ha sido registrado';
    }
    return this.contactForm.controls.email.hasError('email') ? 'Email no válido' : '';
  }

  oncreate(form){

    this.contactosService.crearContacto(this.contactForm.value).then(() => {

      this.contactForm.setValue({

        nombreCompleto: '', 
        email: '', 
        motivo: '',
        mensaje: ''
  
      });
      
    }, (error) => {
      console.error(error);
    }); 
  }
}
