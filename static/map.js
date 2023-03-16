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

function getColor_old(value) {
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

function getColor(value, minVal, maxVal) {
      var colors = d3.interpolateRdYlBu;
      var colorScale = d3.scaleLinear()
        .domain([maxVal, minVal])
        .range([0, 1]);
      const color = colors(colorScale(value));
      console.log(color);
      return color;
    }


function style(feature, minVal, maxVal) {
    return {
        fillColor: getColor(feature.properties.NUMPOINTS, minVal, maxVal),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.85
    };
}

fetch("/data")
    .then(response => response.json())
    .then(data => {
        let maxVal = -Infinity;
        let minVal = Infinity;

        // Loop through features and update max and min values
        data.features.forEach(feature => {
          const val = feature.properties.NUMPOINTS;
          if (val > maxVal) {
            maxVal = val;
          }
          if (val < minVal) {
            minVal = val;
          }
        });
        L.geoJSON(data, {
            style: feature => style(feature, minVal, maxVal)
        }).addTo(map);
        console.log(data);
  })
