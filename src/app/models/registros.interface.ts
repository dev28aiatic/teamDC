//RegistrosI la I de interfaces
export interface RegistrosI{
 
 photoUrl?: string;   
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

export interface ContactosI{
 
     
    nombresCompleto: string;  
    email: string;
    motivo: string;
    mensaje: string;    
   
   }



