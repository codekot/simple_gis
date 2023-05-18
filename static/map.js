var map = L.map('map').setView([57, 52], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function getNormColor(value){
    var colorScale = d3.interpolateSpectral;
    return colorScale(1-value) //using inverse palette
}

function normalizeValue(value, breaks, useJenks){
    if(useJenks){
        var index = d3.bisect(breaks, value);
        return index/(breaks.length - 1)
    } else {
        console.log("nV", value, typeof(breaks))
        return value/breaks[breaks.length - 1]
    }
}

function getColor(value, breaks, useJenks) {
    var normalizedValue = normalizeValue(value, breaks, useJenks);
    return getNormColor(normalizedValue);
}

function style(feature, data, useJenks, breaks) {
    let fillColor;
    console.log("style", typeof(breaks))

    fillColor = getColor(feature.properties.NUMPOINTS, breaks, useJenks);

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

        var numClasses = 0;
        var useJenks = true;
        console.log(data);
        var geoJsonLayer = L.geoJSON(data, {
            style: feature => style(feature, data.features, useJenks, breaks)
        }).addTo(map);
        addLegend(map, breaks, useJenks);
        map.fitBounds(geoJsonLayer.getBounds());
  })


function addLegend(map, breaks, useJenks){
    var legend = L.control({position: 'topright'});

    legend.onAdd = function (map) {
        console.log("Adding legend...")
        var div = L.DomUtil.create('div', 'info legend');
        breaks.forEach(function(value){
        div.innerHTML +=
            '<i class="color-box" style="background-color:' + getColor(value, breaks, useJenks) + '"></i> ' + value +
            '<br>';
        });

        return div;
    };

    legend.addTo(map);
}

