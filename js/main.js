'use strict';

const map = L.map('mapid'); //perus leaflet kartta

//Tänne kartan haku nykyisten koordinaattien avulla
//Ja kartan tileLayerin asettaminen

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.setView([51.505, -0.09], 13); //Placeholder koordinaatit