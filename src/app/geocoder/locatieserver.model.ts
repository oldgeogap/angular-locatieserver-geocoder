export class SuggestResult {
  id: string;
  score: number;
  type: string;
  weergavenaam: string;
}
export class SuggestResponse {
  docs: SuggestResult[];
  maxScore: number;
  numFound: number;
  start: number;
}

export class SuggestResultObject {
  highlighting: {};
  response: SuggestResponse;
  spellcheck: {
    collations: any,
    suggestions: any
  };
}

export class LookupResult {
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

export class LookupResponse {
  docs: LookupResult[];
}

export class LookupResultObject {
  response: LookupResponse;
}
