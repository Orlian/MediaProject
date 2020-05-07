'use strict';

////// Leaflet kartta //////

const map = L.map('mapid'); //perus leaflet kartta

let myPos = null;
const googleKey = 'AIzaSyB022qL0H1EcgjrunZEr0p1ZZHeZwbNhjM';

//Perus tile layer, ruma kuin synti, voi vaihtaa halutessa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//Lisää Google Maps layerin kartalle (dark-mode tyylittelyn kera)
/*
let roads = L.gridLayer.googleMutant({
  type: 'roadmap',	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  styles: [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}]
    }
  ]

}).addTo(map);
*/


/////// Leaflet kartta loppuu ///////

/////// Nähtävyyksien haku kartalla ///////

const openTripKey = "5ae2e3f221c38a28845f05b627e4e3f176dbe8ffe53c291569850faa";

function getLandMarks(crd){
  fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=20000&lon=${crd.longitude}&lat=${crd.latitude}
  &format=json&limit=50&apikey=${openTripKey}`).
      then(function(response){
        return response.json();
      }).
      then(function(landMarks){
        console.log(landMarks);
        for(let i = 0; i < landMarks.length; i++){
          const coordinates = {
            'lat': landMarks[i].point.lat,
            'lon': landMarks[i].point.lon
          };
          if(landMarks[i].name === '' || landMarks[i].name === null){

          }
          else{
            const info = `<h3>${landMarks[i].name}<br/>Lat: ${coordinates.lat} Lon: ${coordinates.lon}</h3>`;
            addMarker(coordinates, info, landMarks[i]);
          }
        }
      })
}
function addMarker(coordinates, info, landMark) {
  L.marker([coordinates.lat, coordinates.lon])
  .addTo(map)
  .bindPopup(info)
  .on('click', function(){
    //Tänne jotain hauskaa vielä
  });
}
const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
function youAreHere(coordinates) {
  L.marker([coordinates.latitude, coordinates.longitude], {icon: redIcon}).addTo(map)
  .bindPopup(`<h3>You are here!<br/>Lat: ${coordinates.latitude} Lon: ${coordinates.longitude}</h3>`)
  .openPopup();
}

/////// Nähtävyyksien haku loppuu ////////

/////// Gps-paikannus ///////

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
//Paikkatiedot löytyy onnistuneesti
function success(pos) {
  myPos = pos.coords;
//Haetaan kartta nykyisillä koordinaateilla
  map.setView([myPos.latitude, myPos.longitude], 13);
  getCurrentWeather(myPos);
  getLandMarks(myPos);
  youAreHere(myPos);
}

//Paikkatietoja ei löydy
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

/////// Gps-paikannus loppuu ///////