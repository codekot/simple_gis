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

function getColor(value) {
  if (value > 5000) {
    return "#800026";
  } else if (value > 1000) {
    return "#BD0026";
  } else if (value > 500) {
    return "#E31A1C";
  } else {
    return "gray";
  }
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.NUMPOINTS),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

fetch("/data")
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: style
        }).addTo(map);
        console.log(data);
  })
