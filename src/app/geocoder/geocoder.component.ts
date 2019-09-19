import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit,  ViewChild, ElementRef} from '@angular/core';
import { GeocoderService } from './geocoder.service';

// Leaflet requires the old school way for importing
declare var require: any;
const L = require('leaflet');

@Component({
  styleUrls: ['geocoder.component.scss'],
  templateUrl: 'geocoder.component.html',
  selector: 'app-geocoder'
})

export class GeocoderComponent implements OnInit, AfterViewInit {
  @ViewChild('geocoder', {static: true}) private geocoderRef: ElementRef;
  @Input() type: string;
  @Input() placeholder: string;
  @Output() placeFound: EventEmitter<any> = new EventEmitter<any>();

  public searchInput = '';
  public places = [];
  public collations = [];
  public searchThreshold = 2;
  public foundPlace: any = null;
  public selectedItem = [];
  public selectedIndex = -1;

  constructor(public geocoderService: GeocoderService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    L.DomEvent.disableClickPropagation(this.geocoderRef.nativeElement);
  }

  public lookup(id: string) {
    this.geocoderService.lookup(id).then((lookupObj) => {
      this.foundPlace = lookupObj;
      this.fillInput(this.foundPlace.weergavenaam);
      this.placeFound.emit(this.foundPlace);
      this.clearPlaces();
    });
  }

  public suggest(event: KeyboardEvent) {
    if (event && event.code && event.code === 'Enter') {
      return;
    }

    if (this.searchInput.length > this.searchThreshold) {
      const params = {fq: '*:*'};

      if (this.type) {
        const replace = ',';
        const regex = new RegExp(replace, 'g');
        const query = this.type.replace(regex, ' OR ');
         params.fq = `type:(${query})`;
      }

      this.geocoderService.suggest(this.searchInput, params).then((suggestResponse) => {
        this.places = suggestResponse.places;
        this.collations = suggestResponse.collations;
      });
    } else {
      this.clearPlaces();
    }
  }

  public clear() {
    this.foundPlace = null;
    this.searchInput  = '';
    this.clearPlaces();
  }

  public clearPlaces() {
    this.resetIndex();
    this.places = [];
    this.collations = [];
  }


  public handleEnter() {
    if (this.selectedIndex === -1) {
      return;
    }
    const selectedPlace = this.places[this.selectedIndex];
    this.lookup(selectedPlace.id);
  }

  public isNoResultsFound() {
    const reachedThreshold = this.searchInput.length > this.searchThreshold;
    const noSuggestions = this.places.length === 0;
    const noResult = (this.foundPlace == null);
    return (reachedThreshold) && (noSuggestions) && (noResult);
  }

  public showCollations() {
    return this.collations.length > 0 && this.places.length === 0;
  }

  private fillInput(content: string) {
    this.searchInput = content;
  }

  public isHighlighted(i) {
    if (i === this.selectedIndex) {
      return true;
    }
  }

  public moveUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  public moveDown() {
    if (this.selectedIndex < this.places.length) {
      this.selectedIndex++;
    }
  }

  public resetIndex() {
    this.selectedIndex = -1;
  }

  public canQuery() {
    if (this.searchInput.length > this.searchThreshold) {
      return true;
    }
  }

  public canClear() {
    if (this.searchInput.length > 0) {
      return true;
    }
  }

  public formatPlaceholder() {
    let placeholderText = 'Zoeken op de kaart...';

    if (this.placeholder) {
      placeholderText = this.placeholder;
    }
    return placeholderText;
  }
}
