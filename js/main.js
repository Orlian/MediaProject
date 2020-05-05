'use strict';

////// Leaflet kartta //////

const map = L.map('mapid'); //perus leaflet kartta

let myPos = null;
const googleKey = 'AIzaSyB022qL0H1EcgjrunZEr0p1ZZHeZwbNhjM';

//Perus tile layer, ruma kuin synti, voi vaihtaa halutessa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

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



/////// Leaflet kartta loppuu ///////

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
}

//Paikkatietoja ei löydy
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

/////// Gps-paikannus loppuu ///////

/////// Paikallisen sään hakeminen ///////

function getCurrentWeather(crd) {
  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&APPID=ecb61f924f197bcf5abcfe9b08094bca`).
      then(function(vastaus) {
        console.log(vastaus);
        return vastaus.json();
      }).
      then(function(data) {
        console.log(data);
        document.querySelector('#city').innerHTML = data.name;
        document.querySelector('#weather_type').innerHTML = data.weather[0].main + ': ' +data.weather[0].description;
        document.querySelector('#temperature').innerHTML = 'Temperature: ' + Math.round(data.main.temp) + ' °C';
        document.querySelector('#humidity').innerHTML = 'Humidity: ' + data.main.humidity + '%';
      }).catch(function(error){
    console.log(error.message);
  })
}

/////// Paikallisen sään hakeminen loppuu ///////

/////// Kello ////////

//Nappi aloittaa laskurin alusta ja pysäyttää sen

let startTime;
let timerOn;
let timerInterval;

function startClock(){
  //if-lause pysäyttää kellon
  if (timerOn){
    clearInterval(timerInterval);
    timerOn = false;
    return;
  }

  startTime = Date.now(); //aloitusaika millisekunteina
  timerInterval = setInterval(refreshClock,100);
  timerOn = true;
}

function refreshClock(){
  let milliTime = Date.now() - startTime;         //kulunut aika
  let secTime = Math.floor(milliTime/1000);    //alkavina sekunteina

  //muunnos tunteihin, minuutteihin ja sekunteihin
  let hours = Math.floor(secTime / 3600);
  secTime %= 3600;
  let minutes = Math.floor(secTime / 60);
  let seconds = secTime % 60;

  //sijoita aika
  document.querySelector("#clock p").innerHTML = `${hours}h ${minutes}m ${seconds}s`;
}

document.getElementById("clock_button").addEventListener("click", startClock);

/////// Kello loppuu ///////

/////// YouTube ////////

let key = "AIzaSyC6OSH2PUTmZabXQeuN4kcYiGoBNGnf1Yw";
let playlists = [];
//encodeuri()

//hakee käyttäjän ID:n nimen perusteella, alkaa napin painalluksesta
function getChannelID(){
  let username = document.getElementById("username_box").value;
  username = encodeURI(username);

  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${username}&key=${key}`).
      then(function(vastaus){
        return vastaus.json();
      }).
      then(function(data){
        getPlaylists(data.items[0].id);
      }).catch(function(error){
    console.log(error.message);
  });
}

//hakee soittolistat käyttäjän ID:n perusteella
function getPlaylists(userID){
  fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${userID}&maxResults=50&key=${key}`).
      then(function(vastaus){
        return vastaus.json();
      }).
      then(function(data){
        playlists = data.items;
        listPlaylists();
      }).
      catch(function(error){
        console.log(error.message);
      });
}

//Lisää soittolistat valintatauluun
function listPlaylists(){
  const element = document.getElementById("Playlists");
  element.innerHTML = "";
  for (let x = 0; x < playlists.length; x++){
    let title = playlists[x].snippet.title;
    let id = playlists[x].id;
    element.innerHTML += `<option value="${id}">${title}</option>`;
  }
}

//Vaihtaa soittolistan
function replacePlaylist(){
  const element = document.getElementById("video");
  const playlistID = document.getElementById("Playlists").value;

  element.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=${playlistID}" 
  frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;

}

document.getElementById("username_button").addEventListener("click", getChannelID);
document.getElementById("playlist_button").addEventListener("click", replacePlaylist);



/////// YouTube loppuu ////////
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