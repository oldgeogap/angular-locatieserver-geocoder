import { Injectable, Injector, FactoryProvider } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { SuggestResultObject, SuggestResult, LookupResultObject, LookupResult } from './locatieserver.model';
import { GeocoderSuggest } from './geocoder.model';

// * Make sure terraformer and terraformer WKT parser is installed */
import * as terraformer from 'terraformer';
import * as terraformerWktParser from 'terraformer-wkt-parser';

@Injectable()
export class GeocoderService {
  public geocoderBaseUrl = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3';
  constructor(
    private injector: Injector,
    private http: HttpClient,
  ) {
  }

  public suggest(query: string): Promise<GeocoderSuggest[]> {
    return this.http.get(`${this.geocoderBaseUrl}/suggest?`, {
      params: {
        q: query,
        fq: '*' // Also get percelen
      }
    }).toPromise().then((suggestResultObject: SuggestResultObject) => {
      return this.formatSuggestResponse(suggestResultObject);
    });
  }

  public lookup(id: string) {
    return this.http.get(`${this.geocoderBaseUrl}/lookup?`, {
      params: {
        id: id,
        fl: '*',
      }
    }).toPromise().then((lookupResultObject: LookupResultObject) => {
      return this.formatLookupResponse(lookupResultObject);
    });
  }

  public free() {

  }

  private formatSuggestResponse(suggestResultObject: SuggestResultObject) {
    const formattedResponse = suggestResultObject.response.docs.map((suggestResult: SuggestResult) => {
      return {
        id: suggestResult.id,
        type: suggestResult.type,
        weergavenaam: suggestResult.weergavenaam,
        score: suggestResult.score,
        highlight: suggestResultObject.highlighting[suggestResult.id].suggest[0]
      }
    });
    return formattedResponse;
  }

  /**
   * Parse WKT in lookup & free response so OpenLayers can handle it.
   */
  private formatLookupResponse(lookupResultObject: LookupResultObject) {
    const formatted = lookupResultObject.response.docs.map((lookupResult) => {
      const formattedLookupResult: any = lookupResult;
      // formattedLookupResult.centroide_ll = terraformerWktParser.parse(lookupResult.centroide_ll);
      // formattedLookupResult.centroide_rd = terraformerWktParser.parse(lookupResult.centroide_rd);
      // formattedLookupResult.geometrie_rd = terraformerWktParser.parse(lookupResult.geometrie_rd);
      // formattedLookupResult.geometrie_ll = terraformerWktParser.parse(lookupResult.geometrie_ll);
      // formattedLookupResult.bbox_rd = (new terraformer.Primitive(formattedLookupResult.geometrie_rd) as any).bbox();
      // formattedLookupResult.bbox_ll = (new terraformer.Primitive(formattedLookupResult.geometrie_ll) as any).bbox();
      return formattedLookupResult;
    });

    return formatted[0] || {};
  }


}
