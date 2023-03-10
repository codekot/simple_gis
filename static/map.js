var map = L.map('map').setView([57, 52], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch("/data")
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
        console.log(data);
  })
