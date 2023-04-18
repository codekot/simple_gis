var map = L.map('map').setView([57, 52], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function getMinMaxValues(data) {
  let maxVal = -Infinity;
  let minVal = Infinity;

  data.features.forEach(feature => {
    const val = feature.properties.NUMPOINTS;
    if (val > maxVal) {
      maxVal = val;
    }
    if (val < minVal) {
      minVal = val;
    }
  });

  return [minVal, maxVal];
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

function getColorJenks(value, data, breaks) {
    var series = data.map(function(feature) {
        return feature.properties.NUMPOINTS;
    });
    var index = d3.bisect(breaks, value);
    //var colorScale = d3.interpolateRdYlBu;
    var colorScale = d3.interpolateSpectral;
    //var colorScale = d3.interpolateBuYlRd;
    //var colors = d3.schemeCategory10;
    var color = colorScale(1-(index/ (breaks.length - 1)));
    //console.log(color);
    return color;
}

function style(feature, data, minVal, maxVal, useJenks, breaks) {
    let fillColor;

    if(useJenks){
        fillColor = getColorJenks(feature.properties.NUMPOINTS, data, breaks);
    }
    else {
        fillColor: getColor(feature.properties.NUMPOINTS, minVal, maxVal)
    }
    return {
        fillColor,
        weight: 0.1,
        opacity: 1,
        color: 'grey',
        fillOpacity: 0.85
    }
}

fetch("/data")
    .then(response => response.json())
    .then(input => {
        data = input.geojson;
        breaks = input.breaks;
        const [minVal, maxVal] = getMinMaxValues(data);

        var numClasses = 0;
        var useJenks = true;
        console.log(data);
        var geoJsonLayer = L.geoJSON(data, {
            style: feature => style(feature, data.features, minVal, maxVal, useJenks, breaks)
        }).addTo(map);
        map.fitBounds(geoJsonLayer.getBounds());
  })
