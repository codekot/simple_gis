var map = L.map('map').setView([57, 52], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


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
    var colorScale = d3.interpolateRdYlBu;
    //var colorScale = d3.interpolateBuYlRd;
    //var colors = d3.schemeCategory10;
    var color = colorScale(1-(index/ (breaks.length - 1)));
    //console.log(color);
    return color;
}

function style(feature, data, minVal, maxVal, useJenks, breaks) {
    if(useJenks){
        console.log("Using Jenks natural breaks")
        return {
            fillColor: getColorJenks(feature.properties.NUMPOINTS, data, breaks),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.85
          };
    }
    else {
        return {
            fillColor: getColor(feature.properties.NUMPOINTS, minVal, maxVal),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.85
        };
    }
}

fetch("/data")
    .then(response => response.json())
    .then(input => {
        data = input.geojson;
        breaks = input.breaks;
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
        /*L.geoJSON(data, {
            style: feature => style(feature, minVal, maxVal)
        }).addTo(map);*/
        var numClasses = 0;
        var useJenks = true;
        console.log(data);
        L.geoJSON(data, {
            style: feature => style(feature, data.features, minVal, maxVal, useJenks, breaks)
        }).addTo(map);
        console.log(data);
  })
