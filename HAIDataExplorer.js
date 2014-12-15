HOSPITALS = new Mongo.Collection("hospitals");
HAI = new Mongo.Collection("hai");
ZIP = new Mongo.Collection("zip");

if (Meteor.isClient) {
  
  var HAI_1_IND = (1106.94 / 1574) + 0.5043827;
  var HAI_2_IND = (2333.22 / 1899); + 0.8529843
  var HAI_3_IND = (1778.69 / 1637); + 0.7230413
  var HAI_4_IND = (747.044 / 401); + 0.95587
  var HAI_5_IND = (1595.41 / 1373); + 0.8025377
  var HAI_6_IND = (2531.17/ 2784); + 0.4947708
  var NURSE_IND = 22.64144 + 4.375094

  //Default zip in Session to initialize without errors. 
  // Session.set('zip', '46311')

  //Show modal on landing page
  Meteor.startup(function() {
    $('.modal').modal('show')
  });

  //load Mapbox
  Mapbox.load(['minimap']);
  var map;
  var markerLayer;
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

  //Load mapbox
  Tracker.autorun(function (computation) {
    if (Mapbox.loaded()) {
      L.mapbox.accessToken = config.token;
      map = L.mapbox.map(config.containerId, config.projectId);
      map.setView(config.defaults.alabama, config.defaults.zoom);
      computation.stop();
    }
  });

  //Subscribe to model everytime they change
  Tracker.autorun(function() {
    //Subscribe to zip
    Meteor.subscribe('zip', Session.get('zip'));
    zipcode = ZIP.findOne({zip: Session.get('zip')});

    if (zipcode) {
      Session.set('lat', zipcode.lat)
      Session.set('lon', zipcode.lon)
      lat = zipcode.lat;
      lon = zipcode.lon;
      map.setView([lat,lon], 8);
     }

    //Subscribe to hospitals data
    Meteor.subscribe('hosp', Session.get('lat'), Session.get('lon'));


    Meteor.subscribe('hai', Session.get('lat'), Session.get('lon'), function() {
      //Remove old layers
      if (markerLayer) {markerLayer.clearLayers();}
      
      //Add new layer
      markerLayer = L.mapbox.featureLayer();
      HOSPITALS.find({}).forEach(function(hospital) {
        markerLayer.addLayer(
          L.circleMarker([hospital.lat, hospital.lon], { color: 'red' })
          .setRadius(6)
          .bindPopup(hospital.name)
        ).addTo(map);
      });
    });
  });

  Template.sidebar.helpers({
    hospitals: function() {
      if (Session.equals('disease_type', 'cancer')) {return HOSPITALS.find({}, {sort:{cancer:-1}});}
      if (Session.equals('disease_type', 'cardiology')) {return HOSPITALS.find({}, {sort:{cardiology:-1}});}
      if (Session.equals('disease_type', 'gastrology')) {return HOSPITALS.find({}, {sort:{gastro:-1}});}
      if (Session.equals('disease_type', 'nephrology')) {return HOSPITALS.find({}, {sort:{nephrology:-1}});}
      if (Session.equals('disease_type', 'pulmonology')) {return HOSPITALS.find({}, {sort:{pulmonology:-1}});}
      if (Session.equals('disease_type', 'urology')) {return HOSPITALS.find({}, {sort:{urology:-1}});}

    }
  });

  Template.hospital.helpers({
    hospital_name: function() {
      return this.name;
    },

    score: function() {
      if (Session.equals('disease_type', 'cancer')) {return this.cancer;}
      if (Session.equals('disease_type', 'cardiology')) {return this.cardiology;}
      if (Session.equals('disease_type', 'gastrology')) {return this.gastro;}
      if (Session.equals('disease_type', 'nephrology')) {return this.nephrology;}
      if (Session.equals('disease_type', 'pulmonology')) {return this.pulmonology;}
      if (Session.equals('disease_type', 'urology')) {return this.urology;}

    },

    hai_1_color: function() {
      var hai_1 = HAI.findOne( {name: this.name, measure_id: 'HAI_1_SIR'}, {fields: {score:1}} );
      var is_sig;
      if (hai_1) {
        is_sig = hai_1.score < HAI_1_IND ? "green" : "red";
      }
      return is_sig || "yellow";
    },

    hai_2_color: function() {
      var hai_2 = HAI.findOne( {name: this.name, measure_id: 'HAI_2_SIR'}, {fields: {score:1}} );
      var is_sig;
      if (hai_2) {
        is_sig = hai_2.score < HAI_2_IND ? "green" : "red";
      }
      return is_sig || "yellow";
    },

    hai_3_color: function() {
      var hai_3 = HAI.findOne( {name: this.name, measure_id: 'HAI_3_SIR'}, {fields: {score:1}} );
      var is_sig;
      if (hai_3) {
        is_sig = hai_3.score < HAI_3_IND ? "green" : "red";
      }
      return is_sig || "yellow";
    },

    hai_4_color: function() {
      var hai_4 = HAI.findOne( {name: this.name, measure_id: 'HAI_4_SIR'}, {fields: {score:1}} );
      var is_sig;
      if (hai_4) {
        is_sig = hai_4.score < HAI_4_IND ? "green" : "red";
      }
      return is_sig || "yellow";
    },

    hai_5_color: function() {
      var hai_5 = HAI.findOne( {name: this.name, measure_id: 'HAI_5_SIR'}, {fields: {score:1}} );
      var is_sig;
      if (hai_5) {
        is_sig = hai_5.score < HAI_5_IND ? "green" : "red";
      }
      return is_sig || "yellow";
    },

    hai_6_color: function() {
      var hai_6 = HAI.findOne( {name: this.name, measure_id: 'HAI_6_SIR'}, {fields: {score:1}} );
      var is_sig;
      if (hai_6) {
        is_sig = hai_6.score < HAI_6_IND ? "green" : "red";
      }
      return is_sig || "yellow";
    },

    nurse_1_color: function() {
      var nurse_1 = HAI.findOne({name: this.name, hcahps_measure_id:'H_COMP_4_U_P'});
      var is_sig;
      if (nurse_1) {
        is_sig = nurse_1.hcahps_answer_percent < NURSE_IND ? "green" : "red";
      }
      return is_sig || "yellow";
    }

  });

  Template.profile.events({
    'click #saveProfile': function(evt) {
      Session.set( 'zip', $('#zip').val() );
      Session.set( 'disease_type', $('#disease_type').val() );
    }
  });

};


if (Meteor.isServer) {

  Meteor.publish('hosp', function(latitude, longitude) {
    return HOSPITALS.find({
      measure_id: "HAI_1_SIR",
      score: {$gt:-1},
      lat: {$gt: latitude - 1, $lt: latitude + 1},
      lon: {$gt: longitude - 1, $lt: longitude + 1},
      cancer: { $exists:true }
    });
  });

  //Publish HAI_1_SIR data
  Meteor.publish('hai', function(latitude, longitude) {
    return HAI.find({
      measure_id: {$in:["HAI_1_SIR","HAI_2_SIR","HAI_3_SIR","HAI_4_SIR","HAI_5_SIR", "HAI_6_SIR"]},
      score: {$gt:-1},
      lat: {$gt: latitude - 1, $lt: latitude + 1},
      lon: {$gt: longitude - 1, $lt: longitude + 1},
      cancer: { $exists:true },
      cardiology: { $exists:true },
      gastro: { $exists:true },
      nephrology: { $exists:true },
      pulmonology: { $exists:true },
      urology: { $exists:true }
    });
  });

  //Publish zip code data
  Meteor.publish('zip', function(zip) {
    return ZIP.find({zip:zip});
  });

  Meteor.startup(function () {



 // Populate db with HOSPITALS if empty
    if (HOSPITALS.find().count() === 0) {

      console.log("starting HOSP upload");

      var hospital_data = JSON.parse(Assets.getText('hosp.json'));
      _.each(hospital_data.data, function(hospital) {
        if (+hospital[19] > 0) {
          HOSPITALS.insert({
            name: hospital[9],
            zip: +hospital[13],
            measure_id: hospital[17],
            score: +hospital[19],
            lat: +hospital[23][1],
            lon: +hospital[23][2]
          });
        }
      });
    }

    // Populate db with HAI if empty
    if (HAI.find().count() === 0) {

      console.log("starting hai upload");

      var hospital_data = JSON.parse(Assets.getText('hosp.json'));
      _.each(hospital_data.data, function(hospital) {
        if (+hospital[19] > 0) {
          HAI.insert({
            name: hospital[9],
            zip: +hospital[13],
            measure_id: hospital[17],
            score: +hospital[19],
            lat: +hospital[23][1],
            lon: +hospital[23][2]
          });
        }
      });

    // Load HCAHPS data
    console.log('load hcahps data');
    var hcahps_data = JSON.parse(Assets.getText('hcahps.json'));
    _.each(hcahps_data, function(hcahps) {

      HCAHPS.insert({ name: hcahps.hospital_name,
                      hcahps_measure_id: hcahps.hcahps_measure_id, 
                      hcahps_answer_percent: hcahps.hcahps_answer_percent }
                );

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

    if (HAI.find().count() === 0) {

        console.log("starting cancer data upload");

        var cancer_data = JSON.parse(Assets.getText('cancer.json'));
        _.each(cancer_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase();

          HOSPITALS.update({ name: hospital_name },
                     { $set: { cancer: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting cardiology data upload");

        var cardiology_data = JSON.parse(Assets.getText('cardiology.json'));
        _.each(cardiology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { cardiology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting diabetes data upload");

        var diabetes_data = JSON.parse(Assets.getText('diabetes.json'));
        _.each(diabetes_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { diabetes: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting ent data upload");

        var ent_data = JSON.parse(Assets.getText('ent.json'));
        _.each(ent_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { ent: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting gastro data upload");

        var gastro_data = JSON.parse(Assets.getText('gastro.json'));
        _.each(gastro_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { gastro: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting geriatric data upload");

        var geriatric_data = JSON.parse(Assets.getText('geriatric.json'));
        _.each(geriatric_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { geriatric: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting gynecology data upload");

        var gynecology_data = JSON.parse(Assets.getText('gynecology.json'));
        _.each(gynecology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { gynecology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting nephrology data upload");

        var nephrology_data = JSON.parse(Assets.getText('nephrology.json'));
        _.each(nephrology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { nephrology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting neuro data upload");

        var neuro_data = JSON.parse(Assets.getText('neuro.json'));
        _.each(neuro_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { neuro: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting ophthalmology data upload");

        var ophthalmology_data = JSON.parse(Assets.getText('ophthalmology.json'));
        _.each(ophthalmology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { ophthalmology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting orthopedics data upload");

        var orthopedics_data = JSON.parse(Assets.getText('orthopedics.json'));
        _.each(orthopedics_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { orthopedics: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting psychiatry data upload");

        var psychiatry_data = JSON.parse(Assets.getText('psychiatry.json'));
        _.each(psychiatry_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { psychiatry: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting pulmonology data upload");

        var pulmonology_data = JSON.parse(Assets.getText('pulmonology.json'));
        _.each(pulmonology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { pulmonology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting rehabilitation data upload");

        var rehabilitation_data = JSON.parse(Assets.getText('rehabilitation.json'));
        _.each(rehabilitation_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { rehabilitation: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting rheumatology data upload");

        var rheumatology_data = JSON.parse(Assets.getText('rheumatology.json'));
        _.each(rheumatology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { rheumatology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting urology data upload");

        var urology_data = JSON.parse(Assets.getText('urology.json'));
        _.each(urology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HOSPITALS.update({ name: hospital_name },
                     { $set: { urology: hospital.score } },
                      { multi: true }
                    );
        });
        


        console.log("starting cancer data upload");

        var cancer_data = JSON.parse(Assets.getText('cancer.json'));
        _.each(cancer_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase();

          HAI.update({ name: hospital_name },
                     { $set: { cancer: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting cardiology data upload");

        var cardiology_data = JSON.parse(Assets.getText('cardiology.json'));
        _.each(cardiology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { cardiology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting diabetes data upload");

        var diabetes_data = JSON.parse(Assets.getText('diabetes.json'));
        _.each(diabetes_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { diabetes: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting ent data upload");

        var ent_data = JSON.parse(Assets.getText('ent.json'));
        _.each(ent_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { ent: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting gastro data upload");

        var gastro_data = JSON.parse(Assets.getText('gastro.json'));
        _.each(gastro_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { gastro: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting geriatric data upload");

        var geriatric_data = JSON.parse(Assets.getText('geriatric.json'));
        _.each(geriatric_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { geriatric: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting gynecology data upload");

        var gynecology_data = JSON.parse(Assets.getText('gynecology.json'));
        _.each(gynecology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { gynecology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting nephrology data upload");

        var nephrology_data = JSON.parse(Assets.getText('nephrology.json'));
        _.each(nephrology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { nephrology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting neuro data upload");

        var neuro_data = JSON.parse(Assets.getText('neuro.json'));
        _.each(neuro_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { neuro: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting ophthalmology data upload");

        var ophthalmology_data = JSON.parse(Assets.getText('ophthalmology.json'));
        _.each(ophthalmology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { ophthalmology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting orthopedics data upload");

        var orthopedics_data = JSON.parse(Assets.getText('orthopedics.json'));
        _.each(orthopedics_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { orthopedics: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting psychiatry data upload");

        var psychiatry_data = JSON.parse(Assets.getText('psychiatry.json'));
        _.each(psychiatry_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { psychiatry: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting pulmonology data upload");

        var pulmonology_data = JSON.parse(Assets.getText('pulmonology.json'));
        _.each(pulmonology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { pulmonology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting rehabilitation data upload");

        var rehabilitation_data = JSON.parse(Assets.getText('rehabilitation.json'));
        _.each(rehabilitation_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { rehabilitation: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting rheumatology data upload");

        var rheumatology_data = JSON.parse(Assets.getText('rheumatology.json'));
        _.each(rheumatology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { rheumatology: hospital.score } },
                      { multi: true }
                    );
        });

        console.log("starting urology data upload");

        var urology_data = JSON.parse(Assets.getText('urology.json'));
        _.each(urology_data, function(hospital) {
          hospital_name = hospital.hospital_name.toUpperCase()

          HAI.update({ name: hospital_name },
                     { $set: { urology: hospital.score } },
                      { multi: true }
                    );
        });


      }







  });
}
