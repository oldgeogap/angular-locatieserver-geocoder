import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { GeocoderService } from './geocoder.service';
import { GeocoderSuggest } from './geocoder.model';

@Component({
  styleUrls: ['geocoder.component.scss'],
  templateUrl: 'geocoder.component.html',
  selector: 'geocoder'
})

export class GeocoderComponent implements OnInit {
  public searchInput = '';
  public suggestions: GeocoderSuggest[] = [];
  public result: any = null;
  public searchThreshold = 3;
  constructor(public geocoderService: GeocoderService) {
  }

  public ngOnInit() {

  }

  public lookup(id: string) {
    this.geocoderService.lookup(id).then((lookupObj) => {
      this.result = lookupObj;
      this.fillInput(this.result.weergavenaam);
      this.clearSuggestions();
    });
  }

  public suggest() {
    if (this.searchInput.length > this.searchThreshold) {
      this.geocoderService.suggest(this.searchInput).then((suggestions: GeocoderSuggest[]) => {
        this.suggestions = suggestions;
      });
    } else {
      this.clearSuggestions();
    }
  }

  public clear() {
    this.result = null;
    this.searchInput  = '';
    this.clearSuggestions();
  }

  public clearSuggestions(){
    this.suggestions = [];
  }

  public isNoResultsFound() {
    const reachedThreshold = this.searchInput.length > this.searchThreshold;
    const noSuggestions = this.suggestions.length === 0;
    const noResult = (this.result == null)
    return (reachedThreshold) && (noSuggestions) && (noResult);
  }

  private fillInput(content: string) {
    this.searchInput = content;
  }
}
