require([
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Search",
    "esri/widgets/Legend"
  ], function(OAuthInfo, IdentityManager, Map, MapView, FeatureLayer, Search, Legend) {
  
    var info = new OAuthInfo({
      appId: "rsLkOWeKLsKiXnrf", // Replace with your Client ID
      popup: false,
      portalUrl: "https://ucsdonline.maps.arcgis.com",
      redirectUri: "https://jackyijun.github.io/ConstructionMapOAuth/" // Replace with your redirect URI
    });
  
    IdentityManager.registerOAuthInfos([info]);
  
    document.getElementById('mapTab').addEventListener('click', function() {
      document.getElementById('generalTabContent').style.display = 'none';
      document.getElementById('mapTabContent').style.display = 'block';
      IdentityManager.checkSignInStatus(info.portalUrl + "/sharing").then(function() {
        loadMap();
      }).catch(function() {
        IdentityManager.getCredential(info.portalUrl + "/sharing");
      });
    });
  
    document.getElementById('generalTab').addEventListener('click', function() {
      document.getElementById('mapTabContent').style.display = 'none';
      document.getElementById('generalTabContent').style.display = 'block';
    });
  
    function loadMap() {
      var map = new Map({
        basemap: "topo-vector"
      });
  
      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-117.236378, 32.8800607], // Longitude, latitude
        zoom: 15
      });
  
      var layer = new FeatureLayer({
        url: "https://services1.arcgis.com/eGSDp8lpKe5izqVc/arcgis/rest/services/polygon_busyness_layer/FeatureServer/0",
        outFields: ["*"], // Ensure all fields are fetched
        popupTemplate: {
          title: "{building}",
          content: [{
            type: "fields",
            fieldInfos: [
              { fieldName: "building", label: "Building" },
              { fieldName: "busyness", label: "Busyness" },
            //   { fieldName: "Shape__Area", label: "Shape Area" },
            //   { fieldName: "Shape__Length", label: "Shape Length" }
            ]
          }]
        }
      });
  
      map.add(layer);
  
      var searchWidget = new Search({
        view: view
      });
  
      view.ui.add(searchWidget, {
        position: "top-right"
      });
  
      var legend = new Legend({
        view: view,
        container: "legendDiv"
      });

      view.ui.add(legend, {
        position: "top-left"
      });
  
    //   view.on("click", function(event) {
    //     view.hitTest(event).then(function(response) {
    //       if (response.results.length) {
    //         var graphic = response.results.filter(function(result) {
    //           return result.graphic.layer === layer;
    //         })[0].graphic;
  
    //         view.popup.open({
    //             title: graphic.getAttribute("building"),
    //             content: "Busyess: " + graphic.getAttribute("busyness"),
    //             location: event.mapPoint
    //           });

    //       }
    //     });
    //   });


    }
  });
  