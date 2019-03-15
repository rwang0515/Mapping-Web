// Define variables for our base layers
var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" + "access_token=pk.eyJ1Ijoia3VsaW5pIiwiYSI6ImNpeWN6bjJ0NjAwcGYzMnJzOWdoNXNqbnEifQ.jEzGgLAwQnZCv9rA6UTfxQ");

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia3VsaW5pIiwiYSI6ImNpeWN6bjJ0NjAwcGYzMnJzOWdoNXNqbnEifQ.jEzGgLAwQnZCv9rA6UTfxQ");

var magnitude = new L.LayerGroup();;

// Create a map object
var myMap = L.map("map-id", {
    center: [48.996452, -101.362104],
    zoom: 3,
    layers: [graymap, magnitude],
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
});

// Add base layers
var baseMaps = {
    Gray: graymap.addTo(myMap),
    Satellite: satellite
};

// Add overlay
var overLay = {
    "Magnitudes": magnitude
};

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overLay, {
    collapsed: false
}).addTo(myMap);

// function increases the size of the markers using a multiplier of 3
function markerSize(size) {
    return size * 2.5;
};
// Query the data with d3
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(err, data) {

    function getColor(magnitude) {
        return magnitude > 5 ? '#8F3B1B' :
            magnitude > 4.9 ? '#D57500' :
            magnitude > 3.9 ? '#404F24' :
            magnitude > 2.9 ? '#668D3C' :
            magnitude > 1.9 ? '#DBCA69' :
            magnitude > .9 ? '#4E6172' :
            '#816C5B';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.mag),
            opacity: 1,
            fillOpacity: 1,
            color: 'black',
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: .5,
        };
    }

    // add GeoJSON layer to the map
    L.geoJson(data, {
            pointToLayer: function(feature, coordinates) {
                return L.circleMarker(coordinates);
            },
            style: style,
            onEachFeature: function(feature, layer) {
                layer.bindPopup("<b>Resort: </b>" + feature.properties.mag +
                    "<br><b>Coordinates: </b>" + feature.geometry.coordinates +
                    "<br><b>Altitude: </b>" + feature.properties.title);
            }

        }).addTo(magnitude),

        magnitude.addTo(myMap);
    // });

    // Create and add Legend to map
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L
            .DomUtil
            .create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#816C5B",
            "#4E6172",
            "#DBCA69",
            "#668D3C",
            "#404F24",
            "#D57500",
            "#8F3B1B"
        ];

        div.innerHTML += '<b>Magnitude</b><br>'

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(myMap);

});