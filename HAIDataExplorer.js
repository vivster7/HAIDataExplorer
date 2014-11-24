HAI = new Mongo.Collection("hai");

if (Meteor.isClient) {
  //Subscribe to hai data
  Meteor.subscribe('hai', function() {
    HAI.find({}).forEach(function(hospital) {
      L.circleMarker([hospital.lat, hospital.lon], {
        color: 'red'
      }).setRadius(hospital.score * 3)
        .addTo(map)
        .bindPopup(hospital.name + "<br />" + "Score: " + String(hospital.score));
    });

  });

  //load Mapbox
  Mapbox.load(['minimap']);
  var map;
  var config = {
      containerId: 'map',
      token: "pk.eyJ1Ijoidml2c3RlcjciLCJhIjoiOWhmRllWTSJ9.AQfstbwy-9Y3VLAM8hqTVQ",
      projectId: "vivster7.kae5dnk1",
      defaults: {
          zoom: 4,
          // Arbitrary location for example purposes
          alabama: [ 31.215, -85.361]
      }
  };

  Tracker.autorun(function (computation) {
    if (Mapbox.loaded()) {
      L.mapbox.accessToken = config.token;
      map = L.mapbox.map(config.containerId, config.projectId);
      map.setView(config.defaults.alabama, config.defaults.zoom);

      computation.stop();
    }
  });

};


if (Meteor.isServer) {

  //Publish HAI_1_SIR data
  Meteor.publish('hai', function() {
    return HAI.find({
      measure_id: "HAI_1_SIR", 
      score: {$gt:-1}
    });
  });

  Meteor.startup(function () {

    // Populate db if empty
    if (HAI.find().count() === 0) {

      var hospital_data = JSON.parse(Assets.getText('hosp.json'));
      _.each(hospital_data.data, function(hospital) {
        HAI.insert({
          name: hospital[9],
          zip: +hospital[13],
          measure_id: hospital[17],
          score: +hospital[19],
          lat: +hospital[23][1],
          lon: +hospital[23][2]
        });
      });

      // var hospitals = [
      //   {name: "SOUTHEAST ALABAMA MEDICAL CENTER",
      //    zip: "36301",
      //    measure_id: "HAI_1_SIR",
      //    score: "1.378",
      //    lat: "31.215",
      //    lon: "-85.361"
      //   },
      //   {name: "MARSHALL MEDICAL CENTER SOUTH",
      //    zip: "35957",
      //    measure_id: "HAI_2_SIR",
      //    score: "0.548",
      //    lat: "34.221",
      //    lon: "-86.159"
      //   }
      // ];

      // _.each(hospitals, function(hospital) {
      //   HAI.insert({
      //     name: hospital.name,
      //     zip: +hospital.zip,
      //     measure_id: hospital.measure_id,
      //     score: +hospital.score,
      //     lat: +hospital.lat,
      //     lon: +hospital.lon
      //   });
      // });
    }

  });
}
