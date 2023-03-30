// Assemble the API query URL.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


//Load JSON Data from url
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  
function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${(feature.properties.mag)}</p>`);
    }
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var color;
            var r = 255;
            var g = Math.floor(255-80*feature.properties.mag);
            var b = Math.floor(255-80*feature.properties.mag);
            color= "rgb("+r+" ,"+g+","+ b+")"
            
            var geojsonMarkerOptions = {
              radius: 4*feature.properties.mag,
              fillColor: color,
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
          }
        
      });
    
      // Send our earthquakes layer to the createMap function/
      createMap(earthquakes);
    }
    //Create map 
    function createMap(earthquakes) {
    
      // Create the base layers.

      let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    
      let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
    
      // Create a baseMaps object.
      let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo}
      
    
      // Create an overlay object to hold our overlay.
      let overlayMaps = {
        Earthquakes: earthquakes
      };
    
      // Create our map, giving it the streetmap and earthquakes layers to display on load.
      let myMap = L.map("map", {
        center: [
          28.8103, 90.4125
        ],
        zoom: 5,
        layers: [street, earthquakes]
      });
    
      // Create a layer control.
      // Pass it our baseMaps and overlayMaps.
      // Add the layer control to the map.
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
      function getColor(d) {
        return d < 1 ? 'rgb(255,255,255)' :
              d < 2  ? 'rgb(255,225,225)' :
              d < 3  ? 'rgb(255,195,195)' :
              d < 4  ? 'rgb(255,165,165)' :
              d < 5  ? 'rgb(255,135,135)' :
              d < 6  ? 'rgb(255,105,105)' :
              d < 7  ? 'rgb(255,75,75)' :
              d < 8  ? 'rgb(255,45,45)' :
              d < 9  ? 'rgb(255,15,15)' :
                          'rgb(255,0,0)';
    }
  
    // Create a legend to display information about our map
    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];
  
        div.innerHTML+='Magnitude<br><hr>'
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(myMap);
    }
    
    

  
   