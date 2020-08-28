import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordsRoutingModule } from './records-routing.module';
import { RecordsComponent } from './records.component';
import { MaterialModule} from 'src/app/material/material.module';



@NgModule({
  declarations: [RecordsComponent],
  imports: [
    CommonModule,
    RecordsRoutingModule,
    MaterialModule,
  
  ]
})
export class RecordsModule { }
