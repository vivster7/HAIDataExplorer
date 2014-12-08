HAI = new Mongo.Collection("hai");
ZIP = new Mongo.Collection("zip");

if (Meteor.isClient) {

  //Show modal on landing page
  Meteor.startup(function() {
    $('.modal').modal('show')
  });

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

  // Subscribe to ZIP
  Meteor.subscribe('zip');

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

  Tracker.autorun(function() {
    Meteor.subscribe('zip', Session.get('zip'));
    zipcode = ZIP.findOne({zip: Session.get('zip')});
    if (zipcode) {
      lat = zipcode.lat;
      lon = zipcode.lon;
      map.setView([lat,lon], 8);
     }
  })

  Tracker.autorun(function (computation) {

    if (Mapbox.loaded()) {
      L.mapbox.accessToken = config.token;
      map = L.mapbox.map(config.containerId, config.projectId);
      map.setView(config.defaults.alabama, config.defaults.zoom);
      window.map = map;

      computation.stop();
    }
  });

  Template.profile.events({
    'click #saveProfile': function(evt) {
      Session.set( 'zip', $('#zip').val() );
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

  //Publish zip code data
  Meteor.publish('zip', function(zip) {
    return ZIP.find({zip:zip});
  });

  Meteor.startup(function () {

    // Populate db with HAI if empty
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
    }

    //Populate db with zip
    if ( ZIP.find().count() === 0 ) {
      var zip_data = JSON.parse(Assets.getText('zip.json'));
      _.each(zip_data, function(zipcode) {
        ZIP.insert({
          zip: zipcode.zip,
          lat: zipcode.latitude,
          lon: zipcode.longitude
        });
      });
    }

  });
}
