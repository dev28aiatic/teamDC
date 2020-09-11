*********
Registros
*********

1. Descripción
    En este componente se debe realizar el registro de cada nuevo usuario, donde el usuario debe ingresar una 
    serie de datos necesaria para su registro.  

2. Importaciones
    Para este componente de debe importar MatTableDataSource para la tabulación de los datos.
    ::
        import { MatTableDataSource } from '@angular/material/table';

    También se importa el servicio con el cual se establece la conexión con la base de datos.
    ::
        import { RegistrosService } from 'src/app/services/registros.service';
    
3. Desarrollo
    Se declara y se inicializa un array con los nombres de las columnas a mostrar.
    :: 
        displayedColumns: string[] = ['nombres',...,'descripcion'];

    Se declara una un objeto de la clase que importamos.
    ::
        dataSource = new MatTableDataSource();

    En el constructor se inyecta el servicio.
    ::
        private registroService:RegistrosService

    En el método ngOnInit se obtienen todos los datos de la base de datos y se los asigna al objeto dataSource.
    ::
        this.registroService.getAllUser().subscribe(res => 
        this.dataSource.data=res);

