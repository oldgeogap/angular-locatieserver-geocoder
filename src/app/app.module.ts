import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { GeocoderModule } from './geocoder/geocoder.module';

@NgModule({
  declarations: [
    AppComponent
    ],
  imports: [
    BrowserModule,
    GeocoderModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
