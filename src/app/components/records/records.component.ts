import { Component, OnInit } from '@angular/core';
import { RegistrosI } from '../../models/registros.interface';
import { MatTableDataSource } from '@angular/material/table';

//paso 1. Importar service
import { RegistrosService } from 'src/app/services/registros.service';



@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  //nombre de las columnas de la tabla
  displayedColumns: string[] = ['nombres', 'apellidos', 'cedula','email','fechaNacimiento',
  'direccion','ciudad','departamento','pais','codigoPostal','profesion','habilidades',
  'descripcion'];

   dataSource = new MatTableDataSource();


 
//paso 2. Inyectar service
  constructor(private registroService:RegistrosService) { }

  ngOnInit(): void {
    this.registroService.getAllUser().subscribe(res => 
      this.dataSource.data=res);
  }
  
  //1.Importar Service
  //2.Inyectar Service
  //3. Utilizar
}
