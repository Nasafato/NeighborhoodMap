"use strict"

var toggled = false;
var map;

var Location = function(lat, long, title) {
	var self = this;

	this.title = title;
	this.isVisible = ko.observable(true);
	this.createMarker = function() {
		var latLong = new google.maps.LatLng(lat, long);
		var newMarker = new google.maps.Marker({
			position: latLong,
			title: title
		});
        var infoWindowHTML = '<b>'+title+'</b><hr>';
		var infoWindow = new google.maps.InfoWindow({
		 	content: infoWindowHTML,
            size: new google.maps.Size(150,50)
        });

        google.maps.event.addListener(newMarker, 'click', function() {
        	infoWindow.open(map, newMarker);
        });

		return newMarker;
	};

	this.marker = this.createMarker(lat, long, title);
	this.marker.setMap(map);

	this.turnOff = function() {
		this.isVisible(false);
		this.marker.setMap(null)
	};

	this.turnOn = function() {
		this.isVisible(false);
		this.marker.setMap(map);
	};
};

var modelSelf;
var LocationListModel = function() {
	modelSelf = this;
	this.locations = ko.observableArray([]);
	this.toggleOff = function() {
		this.locations().forEach(function(location) {
			location.turnOff();
		});
	}

	this.toggleOn = function() {
		this.locations().forEach(function(location) {
			location.turnOn();
		});
	}

	this.addLocation = function(latitude, longitude, title) {
		var newLocation = Location(latitude, longitude, title);
		this.locations().push(newLocation);
	}
};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.8065, lng: -73.9619},
		scrollwheel: true,
		zoom: 16
	});
	modelSelf.locations().push(new Location(40.806129, -73.965654, "Nussbaum and Wu"));
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