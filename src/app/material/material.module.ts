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
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


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
        MatToolbarModule,
        MatSidenavModule,
        MatGridListModule,
        MatTableModule,
        MatSortModule,
        
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
        MatDialogModule,
        MatToolbarModule,
        MatSidenavModule,
        MatGridListModule,
        MatTableModule,
        MatSortModule
    ]
})

export class MaterialModule{}