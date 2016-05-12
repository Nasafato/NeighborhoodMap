"use strict"

var toggled = false;
var modelSelf;
var map;

var requestWikiLinks = function(query) {
	var dataType = 'jsonp';
    var wikiBase = 'http://en.wikipedia.org/w/api.php';
    var wikiUrl = wikiBase + '?action=opensearch&search=' + query + 
        '&format=json&callback=wikiCallback';
     $.ajax({
            url: wikiUrl,
            dataType: dataType,
            success: function(response){
            	/*
                var titleList = response[1];
                var linkList = response[3];

                for (var i = 0; i < titleList.length; i++) {
                    var titleStr = titleList[i],
                        urlStr = 'http://en.wikipedia.org/wiki/' + titleStr;
                    self.links.push({url: urlStr, title: titleStr});
                }
                */
                //console.log(self.links());
                console.log(response);
                console.log("Request succeeded!");
        }
    });
}

requestWikiLinks("coffee");

		    
       

var Location = function(lat, long, title) {
	var self = this;

	this.title = title;
	this.isVisible = ko.observable(true);

	var createMarker = function() {
		var latLong = new google.maps.LatLng(lat, long);
		var newMarker = new google.maps.Marker({
			position: latLong,
			title: title
		});

		return newMarker;
	};

	var createInfoWindow = function(marker) {
		var infoWindowHTML = '<b>'+title+'</b><hr>';
		var infoWindow = new google.maps.InfoWindow({
		 	content: infoWindowHTML,
            size: new google.maps.Size(150,50)
        });

        google.maps.event.addListener(marker, 'click', function() {
        	self.showInfoWindow();
        });

        return infoWindow;
	}

	this.marker = createMarker(lat, long, title);
	this.infoWindow = createInfoWindow(this.marker)
	this.marker.setMap(map);

	this.turnOffInfoWindow = function() {
		this.infoWindow.close();
	};

	this.showInfoWindow = function() {
		modelSelf.toggleOffInfoWindows();
		this.infoWindow.open(map, this.marker);
	}

	this.turnOff = function() {
		this.isVisible(false);
		this.marker.setMap(null)
	};

	this.turnOn = function() {
		this.isVisible(true);
		this.marker.setMap(map);
	};

	this.filter = function(filterString) {
		if (~this.title.indexOf(filterString)) {
			this.turnOn();
		} else {
			this.turnOff();
		}
	}
};

var LocationListModel = function() {
	modelSelf = this;
	var self = this;
	this.locations = ko.observableArray([]);
	this.currentFilter = ko.observable("");

	this.filterLocations = function() {
		this.locations().forEach(function(location) {
			location.filter(self.currentFilter());
		});
	}

	this.toggleOffInfoWindows = function() {
		this.locations().forEach(function(location) {
			location.turnOffInfoWindow();
		});
	}

	this.toggleOffMarkers = function() {
		this.locations().forEach(function(location) {
			location.turnOff();
		});
	}

	this.toggleOnMarkers = function() {
		this.locations().forEach(function(location) {
			location.turnOn();
		});
	}

	this.addLocation = function(latitude, longitude, title) {
		var newLocation = Location(latitude, longitude, title);
		this.locations.push(newLocation);
	}
};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.8065, lng: -73.9619},
		scrollwheel: true,
		zoom: 16
	});
	modelSelf.locations.push(new Location(40.806129, -73.965654, "Nussbaum and Wu"));
	modelSelf.locations.push(new Location(40.807721, -73.964111, "116th Street - Columbia Metro Station"));
	modelSelf.locations.push(new Location(40.804479, -73.966849, "Chipotle Mexican Grill"));
	modelSelf.locations.push(new Location(40.805429, -73.966140, "Columbia Daily Spectator"));
	modelSelf.locations.push(new Location(40.802511, -73.967441, "Absolute Bagels"));
}


ko.applyBindings(new LocationListModel())

function toggleSidebar() {
	var sidebar = document.getElementById("sidebar-wrapper");
	var content = document.getElementById("content-wrapper");
	var hamburgerIconSidebar = document.getElementById("hamburger-icon-sidebar");
	var hamburgerIconContent = document.getElementById("hamburger-icon-content");

	if (toggled) {
		sidebar.removeAttribute("style");
		content.removeAttribute("style");
		toggled = false;
	} else {
		sidebar.style.display = "block";
		sidebar.style.position = "absolute";
		sidebar.style.width = 50 + "%"

		content.style.display = "block";
		content.style.width = 100 + "%";

		hamburgerIconSidebar.style.display = "block";
		toggled = true;
	}
}

window.onresize = function() {
	var sidebar = document.getElementById("sidebar-wrapper");
	var content = document.getElementById("content-wrapper");
	if (window.innerWidth >= 800) {
		toggled = false;
		sidebar.removeAttribute("style");
		content.removeAttribute("style");
	}
}