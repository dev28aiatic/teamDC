import {NgModule} from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from'@angular/material/Card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({

    imports:[

        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule, 
        MatInputModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatListModule,
        MatDialogModule,

        


    ],

    exports:[

        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule, 
        MatInputModule, 
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatListModule,
        MatDialogModule

    ]
})

export class MaterialModule{}