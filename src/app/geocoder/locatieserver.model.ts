// https://github.com/PDOK/locatieserver/wiki/API-Locatieserver

export class BasicGeocoderOptions {
  rows?: number;
  start?: number;
  wt?: string;
  indent?: boolean;
  lat?: number;
  lon?: number;
  fq?: string;
}

export enum ResponseTypes {
  provincie,
  gemeente,
  woonplaats,
  weg,
  postcode,
  adres,
  perceel,
  hectometerpaal,
  wijk,
  buurt,
  waterschapsgrens,
  appartementsrecht
}

export enum ResponseSources {
  BAG,
  NWB,
  'BAG/NWB',
  DKK,
  'Bestuurlijke Grenzen',
  CBS,
  HWH // Waterschapshuis
}

export class SuggestOptions extends BasicGeocoderOptions {
  fl?: string;
  sort?: string;
  qf?: string;
  bq?: string;
}

export class LookupOptions extends BasicGeocoderOptions {
  fl?: string;
}

export class ReverseOptions extends BasicGeocoderOptions {
  fl?: string;
  type?: string;
  distance?: number;
}

export class SuggestResponse {
  highlighting: {};
  response: {
    docs: SuggestObject[];
    maxScore: number;
    numFound: number;
    start: number;
  };
  spellcheck: {
    collations: any,
    suggestions: any
  };
}

export class SuggestObject {
  id: string;
  score: number;
  type: string;
  weergavenaam: string;
}


export class LookupResponse {
  response: {
    docs: LookupObject[]
  };
}

export class LookupObject {
  bron: string;
  centroide_ll: string;
  centroide_rd: string;
  geometrie_ll?: string;
  geometrie_rd?: string;
  gemeentecode?: string;
  gemeentenaam?: string;
  id: string;
  identificatie: string;
  provincieafkorting: string;
  provinciecode: string;
  type: string;
  weergavenaam: string;
}


export class ReverseResponse {
  response: {
    docs: any[];
    maxScore: number;
    numFound: number;
    start: number;
  };
}

export class ReverseGeometry {
  X?: number;
  Y?: number;
  lat?: number;
  lon?: number;
}
