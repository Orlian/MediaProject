'use strict';

const map = L.map('mapid'); //perus leaflet kartta
let myPos = null;

//Perus tile layer, ruma kuin synti, voi vaihtaa halutessa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//Paikkatiedot löytyy onnistuneesti
function success(pos) {
  myPos = pos.coords;
//Haetaan kartta nykyisillä koordinaateilla
  map.setView([myPos.latitude, myPos.longitude], 13);
}

//Paikkatietoja ei löydy
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error);

function getCurrentWeather(crd) {
  fetch(`api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&lang=fi&units=metric&appid=ecb61f924f197bcf5abcfe9b08094bca`).
      then(function(response) {
        return response.json();
      }).
      then(function(data) {

      })
}
/*
Markerin, ympyrän ja polygonin lisääminen kartalle:

  var marker = L.marker([51.5, -0.09]).addTo(map);

  var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

  var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);
 */

/*
Popuppien lisääminen kartalle:

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

Ja stand-alone versiona:

var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);
 */