import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SuggestResultObject, SuggestResult, LookupResultObject, LookupResult } from './locatieserver.model';
import { GeocoderSuggest } from './geocoder.model';
// * Make sure terraformer and terraformer WKT parser is installed */
// import * as Terraformer from 'terraformer';
import * as terraformerWktParser from 'terraformer-wkt-parser';
// const terraformerWktParser = require('terraformer-wkt-parser');
@Injectable()
export class GeocoderService {
  public geocoderBaseUrl = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3';
  constructor(
    private http: HttpClient,
  ) {

  }

  public suggest(query: string) {
    return this.http.get(`${this.geocoderBaseUrl}/suggest?`, {
      params: {
        q: query,
        fq: '*' // Also get percelen
      }
    }).toPromise().then((suggestResultObject: SuggestResultObject) => {
      const collations = this.parseCollations(suggestResultObject.spellcheck.collations);
      const places = this.formatPlaces(suggestResultObject);
      return {collations, places};
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

  public free(searchTerm: string) {
    return this.http.get(`${this.geocoderBaseUrl}/free?`, {
      params: {
        q: searchTerm,
        fl: '*',
        fq: '*'
      },
    }).toPromise().then((freeResultObject: LookupResultObject) => {
      return this.formatLookupResponse(freeResultObject);
    });
  }

  private parseCollations(collations) {
    const parsedCollations = [];
    for (let i = 0; i < collations.length; i+=2) {
      const collation  = {
        id: i,
        naam: collations[i+1].misspellingsAndCorrections[1],
        weergavenaam: `${collations[i+1].hits} resultaten gevonden voor <strong> ${collations[i+1].misspellingsAndCorrections[1]} </strong>`,
        hits: collations[i+1].hits,
      }
      parsedCollations.push(collation);
    }
    return parsedCollations;
  }

  private formatPlaces(suggestResultObject: SuggestResultObject) {
    const places = suggestResultObject.response.docs.map((place: SuggestResult) => {
      return {
        id: place.id,
        type: place.type,
        weergavenaam: place.weergavenaam,
        score: place.score,
        highlight: suggestResultObject.highlighting[place.id].suggest[0]
      }
    });
    return places;
  }

  /**
   * Parse WKT in lookup response.
   */
  private formatLookupResponse(lookupResultObject: LookupResultObject) {
    const formatted = lookupResultObject.response.docs.map((lookupResult) => {
      const formattedLookupResult: any = lookupResult;
      formattedLookupResult.centroide_ll = terraformerWktParser.parse(lookupResult.centroide_ll);
      formattedLookupResult.centroide_rd = terraformerWktParser.parse(lookupResult.centroide_rd);
      formattedLookupResult.geometrie_rd = terraformerWktParser.parse(lookupResult.geometrie_rd);
      formattedLookupResult.geometrie_ll = terraformerWktParser.parse(lookupResult.geometrie_ll);
      // formattedLookupResult.bbox_rd = (new terraformer.Primitive(formattedLookupResult.geometrie_rd) as any).bbox();
      // formattedLookupResult.bbox_ll = (new terraformer.Primitive(formattedLookupResult.geometrie_ll) as any).bbox();
      return formattedLookupResult;
    });

    return formatted[0] || {};
  }


}
