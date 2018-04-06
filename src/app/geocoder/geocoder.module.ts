import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GeocoderComponent } from './geocoder.component';
import { GeocoderService } from './geocoder.service';


@NgModule({
  imports: [ HttpClientModule, FormsModule, CommonModule ],
  exports: [ GeocoderComponent ],
  declarations: [ GeocoderComponent ],
  providers: [ GeocoderService ]
})

export class GeocoderModule {}
export { GeocoderService } from './geocoder.service';
