var ViewModel = function() {
    var self = this;

    self.map = ko.observable(new Map({}));
    self.markers = ko.observable([]);

    self.currentQueryString = ko.observable("");
    self.googleMapsAPIKey = ko.observable("AIzaSyBG0EBRBgIL3eq6mulH_zfKAXkMYN8o_4U");

    self.initializeMap = function() {
        var mapProp = {
          center: new google.maps.LatLng(40.8065, -73.9619),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      self.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  };

  self.addMarker = function(address, title) {
    var geocoder = new google.maps.Geocoder();

    if (geocoder) {
        geocoder.geocode({'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    // initialize the HTML that'll be in the info window
                    var infoWindowContentString = '<b>'+title+'</b><hr>';

                    // get an image of the street view from Google Streetview
                    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=200x100&location=' + address + '';
                    var streetViewImage = '<img src="' + streetviewUrl + '">';
                    infoWindowContentString += streetViewImage;

                    // get the Yelp rating
                    var yelpURL = 'http://api.yelp.com/v2/search?location=' +
                        address;
                    $.getJSON(yelpURL, function(data){
                        console.log(data);
                    }).error(function(e){
                        console.log("Yelp data could not be fetched for location");
                    });



                    // create the infowindow object
                    var infowindow = new google.maps.InfoWindow(
                        { content: infoWindowContentString,
                        size: new google.maps.Size(150,50)
                    });

                    console.log(results);
                    console.log(title);

                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: self.map, 
                        title: title
                    }); 

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(self.map, marker);
                    });

                    marker.setMap(self.map);
                    self.markers().push(marker);
                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocoder failed");
            }
        });
    }

};

self.searchSubmitted = function() {
    self.initializeMap();
    console.log("Query term = " + self.currentQueryString());

}; 

self.initializeMap();
self.addMarker('2897 Broadway, New York, NY 10025', 'Nussbaum and Wu');
};


// object that holds map data
// queryString: the original search string the user input
// imageURL: the address of the image that will be displayed as the map
var Map = function(data) {
    var self = this;
    self.queryString = ko.observable(data.queryString);
    self.imageURL = ko.observable(data.imgSRC);
    self.markers = ko.observableArray([]);

    self.setImage = function(imageURL) {
        self.imageURL = imageURL;
    };

    self.addMarker = function(position, title) {
    }
};

ko.applyBindings(new ViewModel());




