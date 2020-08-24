import { Component, OnInit } from '@angular/core';


//importaciones para el font
//Importar servicio
import {RegistrosService} from './services/registros.service'
//inyectar service
//usar service



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

//se añadio para visualizar => implements OnInit
export class AppComponent implements OnInit{
  title = 'dc';

  ngOnInit(){
    this.registrosService.getRegistros().subscribe(res => console.log(res));
  }
  //inyectar service
  constructor(private registrosService: RegistrosService){

    //usar service

  }

}
