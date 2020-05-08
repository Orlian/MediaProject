'use strict';

/////// Gps-paikannus ///////

let myPos = null;

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
//Paikkatiedot löytyy onnistuneesti
function success(pos) {
  myPos = pos.coords;
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
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&APPID=ecb61f924f197bcf5abcfe9b08094bca`).
      then(function(vastaus) {
        console.log(vastaus);
        return vastaus.json();
      }).
      then(function(data) {
        console.log(data);
        document.querySelector('#city').innerHTML = data.name;
        document.querySelector('#weather_type').innerHTML = data.weather[0].main + ': ' +data.weather[0].description;
        document.querySelector('#temperature').innerHTML = 'Temperature: ' + Math.round(data.main.temp) + ' °C';
        document.querySelector('#feels_like').innerHTML = 'Feels like: ' + Math.round(data.main.feels_like) + '°C';
        document.querySelector('#wind_speed').innerHTML = 'Wind speed: ' + data.wind.speed + 'm/s';
        document.querySelector('#humidity').innerHTML = 'Humidity: ' + data.main.humidity + '%';
        document.querySelector('#air_pressure').innerHTML = 'Air pressure: ' + data.main.pressure + 'hPa';
        //document.querySelector('#visibility').innerHTML = 'Visibility: ' + data.visibility + 'm';
      }).catch(function(error){
    console.log(error.message);
  })
}

/////// Paikallisen sään hakeminen loppuu ///////



/////// YouTube ////////

const youtubeKey = "AIzaSyC6OSH2PUTmZabXQeuN4kcYiGoBNGnf1Yw";
let playlists = [];

//hakee käyttäjän ID:n nimen perusteella, alkaa napin painalluksesta
function getChannelID(){
  let username = document.getElementById("username_box").value;
  username = encodeURI(username);

  fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${username}&key=${youtubeKey}`).
      then(function(vastaus){
        return vastaus.json();
      }).
      then(function(data){
        getPlaylists(data.items[0].id);
      }).catch(function(error){
    console.log(error.message);
  });
}

//hakee soittolistat käyttäjän ID:n perusteella ja tallentaa muistiin
function getPlaylists(userID){
  fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${userID}&maxResults=50&key=${youtubeKey}`).
      then(function(vastaus){
        return vastaus.json();
      }).
      then(function(data){
        playlists = data.items;
        sessionStorage.setItem('lastPlaylists', JSON.stringify(playlists));
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

//Vaihtaa soittolistan napin painalluksesta
function replacePlaylist(){
  const element = document.getElementById("video");
  const playlistID = document.getElementById("Playlists").value;
  sessionStorage.setItem('lastUsedPlaylist', playlistID);
  element.innerHTML = `<iframe id="yt" src="https://www.youtube.com/embed/videoseries?list=${playlistID}" 
  frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

//hakee viimeksi käytetyn soittolistan muistista
let lastPlaylists = JSON.parse(sessionStorage.getItem('lastPlaylists'));
let lastUsedPlaylist = sessionStorage.getItem('lastUsedPlaylist');

if (lastPlaylists != null && lastUsedPlaylist != null){
  window.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById("video");
    const playlistID = lastUsedPlaylist;

    video.innerHTML = `<iframe id="yt" src="https://www.youtube.com/embed/videoseries?list=${playlistID}" 
    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;

    const element = document.getElementById("Playlists");
    element.innerHTML = "";

    for (let x = 0; x < lastPlaylists.length; x++){
      let title = lastPlaylists[x].snippet.title;
      let id = lastPlaylists[x].id;
      element.innerHTML += `<option value="${id}">${title}</option>`;
    }
  });
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
