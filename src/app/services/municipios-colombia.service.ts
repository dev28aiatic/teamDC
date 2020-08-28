import { Injectable } from '@angular/core';

//Para manejo de llamadas a apis con este modulo no necesitas usar fetch ni ajax
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosColombiaService {

  //inyecto el httpClient
  constructor( private http: HttpClient) { 

  }

  //metodos
getDatos():Observable<any>{

  return this.http.get("https://www.datos.gov.co/resource/xdk5-pm3f.json");

}


}
