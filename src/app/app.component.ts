import { Component } from '@angular/core';
import { GeocoderService } from './geocoder/geocoder.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private geocoderService: GeocoderService) {
    // this.geocoderService.reverse({X: 106830, Y: 428564}, {type: 'adres'}).then(test => {
    //   console.log(test);
    // });
    // this.geocoderService.free('oudwijkerlaan 28').then(test => {
    //   console.log(test);
    // });
  }
  // Test function.
  public onPlaceFound(e) {
    console.log(e);
  }
}
