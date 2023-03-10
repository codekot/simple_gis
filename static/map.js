var map = L.map('map').setView([57, 52], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var lineStyle = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.1,
    "fill": false
};

fetch("/data")
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: lineStyle
        }).addTo(map);
        console.log(data);
  })
