# PDOK Locatieserver Angular Component

# Installatie
Het installeren van de PDOK Locatieserver Angular Component is eenvoudig met [NPM](https://www.npmjs.com/package/angular-geocoder) via het volgende command: `npm install angular-geocoder --save`

De meest recente versie van het PDOK Locatieserver Angular Component ondersteunt Angular 6.X.

# Features
 - Responses worden gelijk geparsed van WKT naar GeoJSON (http://geojson.org/)
 - Autocomplete functionaliteit
 - Keypresses (up, down, enter) worden ondersteunt in het doorlopen van de zoek
 - Ondersteunt zowel RD (EPSG:28992) als WGS84 (EPSG:4326)
 - Eenvoudig te customizen

# Gebruik
Om de geocoder te gebruiken in een Angular applicatie moet eerst de `GeocoderModule` worden geïmporteerd in de module waar de geocoder zal komen te staan.

`
import { GeocoderModule } from  'angular-geocoder';`
`@NgModule({`
`...`
`imports: [GeocoderModule]`
`...`
`})`

Vervolgens kan het `GeocoderComponent` worden geimporteerd in een ander component via de html-tag:
 `<geocoder> </geocoder>`

Om iets met het zoekresultaat van de geocoder te doen, moet er worden geluisterd naar het `placeFound` event:
`<geocoder (placeFound)="onPlaceFound($event)> </geocoder>" `

`public onPlaceFound(place) {`
`// Pan map to place, or something else...`
`}`

## Zoeken op specifiek type
Er kan gezocht worden op een specifiek type (zoals, `adres`, `weg`, of `perceel`) via de `type` property. Meerdere typen kunnen worden gekozen door ze te scheiden door  een komma `,` :
`<geocoder type="adres"> </geocoder>" `
`<geocoder type="adres,weg,buurt"> </geocoder>" `

## Veranderen placeholder message
De placeholder message in de geocoder kan worden veranderd door de `placeholder` property te gebruiken:
`<geocoder placeholder="Custom text..."> </geocoder>`

## GeocoderService
Het is ook mogelijk om alleen de `GeocoderService` te gebruiken. Deze kan worden geïmporteerd in een andere service of component door de service in de `constructor` van de component of service mee te geven: 

`constructor(private geocoderService: GeocoderService)`

Dit maakt het mogelijk om de 4 verschillende endpoints `free,suggest,lookup,revgeo` te gebruiken zonder de standaard megeleverde zoekbalk. De `GeocoderService` retourneert standaard een `Promise`. 

### Extra parameters meegeven 
Het is mogelijk om extra parameters mee te geven aan de `free,suggest,lookup,revgeo` endpoints. Zo kan bijvoorbeeld een filterquery worden meegegeven die alleen maar BAG objecten retourneert: 

`this.geocoderService.suggest('Neude', {fq: 'bron:BAG'}).then(result => {`
`// do something`
`});`

Een compleet overzicht over welke parameters bij welk endpoint werken is te vinden in de [API documentatie](https://github.com/PDOK/locatieserver/wiki/API-Locatieserver) van de Locatieserver: 

# FAQ

#### In welk coördinaatsysteem worden de resultaatgeometrieen teruggegeven?
Deze worden zowel in het Rijksdriehoekstelsel (EPSG:28992) als in WGS84 (EPSG:4326) teruggegeven.

#### Waar kan ik de documentatie van de PDOK locatieserver vinden?
https://github.com/PDOK/locatieserver/wiki/API-Locatieserver

# Meehelpen?
Stuur een mailtje naar info@geogap.nl of kijk voor onze contactgegevens op https://geogap.nl .