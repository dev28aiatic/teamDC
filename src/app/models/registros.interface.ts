//RegistrosI la I de interfaces
export interface RegistrosI{

 nombres: string;
 apellidos: string;
 cedula: number;
 email: string;
 fechaNacimiento: string;
 direccion: string;
 ciudad: string;
 departamento: string;
 pais:string;
 codigoPostal:string;
 profesion: string;
 habilidades: string;
 descripcion:string;

}


export interface DatosDepartamentoYMunicipios{

    c_digo_dane_del_departamento:number,
    departamento: string;
    municipio : string,
    
}

