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

    self.addMarker = function(address, title, typeData) {
        var geocoder = new google.maps.Geocoder();

        if (geocoder) {
            geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    // initialize the HTML that'll be in the info window
                    var infoWindowHTML = '<b>'+title+'</b><hr>';

                    infoWindowHTML += appendStreetViewImage(address);

                    if (typeData.foursquare) {
                        var foursquareHTML = appendFoursquareReviews(address, title);
                        console.log(foursquareHTML);
                        infoWindowHTML += foursquareHTML;
                    }

                    if (typeData.wikipedia) {
                        infoWindowHTML += appendWikipediaLinks(title);
                    }
                    

                    // create the infowindow object
                    var infowindow = new google.maps.InfoWindow(
                        { content: infoWindowHTML,
                            size: new google.maps.Size(150,50)
                        });


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
    };

    self.searchSubmitted = function() {
        self.initializeMap();
        console.log("Query term = " + self.currentQueryString());
    }; 
};

// returns the HTML that shows the street view image 
function appendStreetViewImage(coordinates) {
    // get an image of the street view from Google Streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=200x100&location=' + coordinates + '';
    var streetViewImage = '<img src="' + streetviewUrl + '">';

    return streetViewImage;
}

// returns the HTML that lists taglines from first 3 foursquare reviews
function appendFoursquareReviews(coordinates, title) {
    var foursquareHTML = '<div class="foursquare-container">';
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search' +
        '?client_id=1XAJWYDT4R1BMLBJWSMY3S4BMBH2WFH5L5SF3AIR3GQHT2GY' +
        '&client_secret=P2SKFTK5ZUAUW5GXR1ZBW5EX5GBC3P4TMJLBIPLU1EMLS3IK' +
        '&v=20140701' +
        '&near=New York,NY' + 
        '&ll=' + coordinates +
        '&query=' + title;

    $.ajax(foursquareURL, {
        dataType: "json",
        success: function(data) {
            console.log("Foursquare Venue found!");
            var venue = data.response.venues[0];
            var phone = venue.contact.formattedPhone;
            foursquareHTML += '<h3>Phone: ' + phone + '</h3>';
            var venueID = venue.id;

            var tipsURL = 'https://api.foursquare.com/v2/venues/' +
                venueID + '/tips' +
                '?client_id=1XAJWYDT4R1BMLBJWSMY3S4BMBH2WFH5L5SF3AIR3GQHT2GY' +
                '&client_secret=P2SKFTK5ZUAUW5GXR1ZBW5EX5GBC3P4TMJLBIPLU1EMLS3IK' +
                '&v=20140701' +
                '&limit=3' +
                '&sort=popular';

            $.ajax(tipsURL, {
                dataType: "json",
                success: function(tipsData) {
                    console.log("Foursquare Venue tips returned!");
                    foursquareHTML += '<ul class="foursquare-tips-list">';
                    var tips = tipsData.response.tips.items;
                    for (var i = 0; i < tips.length; i++) {
                        foursquareHTML += '<li class="foursquare-tip">' +
                            tips[i].text + '</li>';
                    }

                    return foursquareHTML;
                }
            });
        }
    });

}

// returns the top 3 Wikipedia links related to this place
function appendWikipediaLinks(title) {
    var wikiHTML = '<ul>';
    var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + title + '&format=json&callback=wikiCallback';
    $.ajax(wikipediaUrl, {
        dataType: "jsonp",
        success: function(data) {
            for (var i = 0; i < data[1].length; i++) {
                var pageTitle = data[1][i];
                var pageURL = data[2][i]

                wikiHTML += '<li>' + 
                    '<a href="' + pageURL +'">' + pageTitle + '</a></li>';
            }

            wikiHTML += '</ul>';
            return wikiHTML;
        }
    });

    
}


self.initializeMap();
self.addMarker(
    '40.806129,-73.965654', 
    'Nussbaum and Wu',
    {
        foursquare: true,
        wikipedia: false
    });
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




