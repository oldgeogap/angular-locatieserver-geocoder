import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SuggestResultObject,
        SuggestResult,
        LookupResultObject,
        ReverseOptions,
        ReverseGeometry,
        ReverseResponse,
        SuggestOptions,
        LookupOptions} from './locatieserver.model';

import * as querystring from 'querystring';

declare var require: any;
const terraformerWktParser = require('terraformer-wkt-parser');

@Injectable()
export class GeocoderService {
  public geocoderBaseUrl = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3';
  constructor(
    private http: HttpClient,
  ) {

  }

  public suggest(query: string, options?: SuggestOptions) {
    let params = {
      q: query,
      fq: '*',  // Also get percelen
      start: 0,
      rows: 10,
    };

    if (options) {
      params = Object.assign(params, options);
    }

    return this.http.get(`${this.geocoderBaseUrl}/suggest?` + querystring.stringify(params))
    .toPromise().then((suggestResultObject: SuggestResultObject) => {
      const collations = this.parseCollations(suggestResultObject.spellcheck.collations);
      const places = this.formatPlaces(suggestResultObject);
      return {collations, places};
    });
  }

  public lookup(id: string, options?: LookupOptions) {
    let params = {
      id: id,
      fl: '*'
    };

    if (options) {
      params = Object.assign(params, options);
    }


    return this.http.get(`${this.geocoderBaseUrl}/lookup?` + querystring.stringify(params)).toPromise().then((lookupResultObject: LookupResultObject) => {
      return this.formatLookupResponse(lookupResultObject);
    });
  }

  public free(searchTerm: string, options?: SuggestOptions) {
    let params = {
      q: searchTerm,
      fl: '*',
      fq: '*',
      rows: 10,
      start: 0,
    };

    if (options) {
      params = Object.assign(params, options);
    }

    return this.http.get(`${this.geocoderBaseUrl}/free?` + querystring.stringify(params))
    .toPromise().then((freeResultObject: LookupResultObject) => {
      return this.formatLookupResponse(freeResultObject);
    });
  }


  public reverse(location: ReverseGeometry, options?: ReverseOptions) {
    let params = {
      type:  'adres',
      fq: '*',
      fl: '*',
      rows: 10,
      distance: 200 // meter,
    };

    if (options) {
      params = Object.assign(params, options);
    }

    const reverseUrl = 'http://test.geodata.nationaalgeoregister.nl/locatieserver/revgeo?' + querystring.stringify(location) + '&' + querystring.stringify(params);
    return this.http.get(reverseUrl).toPromise().then((reverseResponse: ReverseResponse) => {
      return this.formatReverseResponse(reverseResponse);
    });

  }

  private parseCollations(collations) {
    const parsedCollations = [];
    for (let i = 0; i < collations.length; i += 2) {
      const collation  = {
        id: i,
        naam: collations[i + 1].misspellingsAndCorrections[1],
        weergavenaam: `${collations[i + 1].hits} resultaten gevonden voor <strong> ${collations[i + 1].misspellingsAndCorrections[1]} </strong>`,
        hits: collations[i + 1].hits,
      };
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
      };
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

  private formatReverseResponse(lookupResultObject: ReverseResponse) {
    const formatted = lookupResultObject.response.docs.map((reverseResult) => {
      const formattedLookupResult: any = reverseResult;
      formattedLookupResult.centroide_ll = terraformerWktParser.parse(reverseResult.centroide_ll);
      formattedLookupResult.centroide_rd = terraformerWktParser.parse(reverseResult.centroide_rd);
      formattedLookupResult.geometrie_rd = terraformerWktParser.parse(reverseResult.geometrie_rd);
      formattedLookupResult.geometrie_ll = terraformerWktParser.parse(reverseResult.geometrie_ll);
      // formattedLookupResult.bbox_rd = (new terraformer.Primitive(formattedLookupResult.geometrie_rd) as any).bbox();
      // formattedLookupResult.bbox_ll = (new terraformer.Primitive(formattedLookupResult.geometrie_ll) as any).bbox();
      return formattedLookupResult;
    });

    return formatted;
  }


}
