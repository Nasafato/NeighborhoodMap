"use strict"

var toggled = false;

console.log(window.innerWidth);

var Location = function(lat, long) {
	var self = this;

	this.lat = lat;
	this.long = long;
	this.isVisible = ko.observable(true);

	this.turnOff = function() {
		this.isVisible(false);
	};

	this.turnOn = function() {
		this.isVisible(false);
	};

};

var LocationListModel = function() {
	this.locations = ko.observableArray([]);

	this.addLocation = function(latitude, longitude) {
		var newLocation = Location(latitude, longitude);
	}
};



function toggleSidebar() {
	var sidebar = document.getElementById("sidebar-wrapper");
	var content = document.getElementById("content-wrapper");
	var hamburgerIconSidebar = document.getElementById("hamburger-icon-sidebar");
	var hamburgerIconContent = document.getElementById("hamburger-icon-content");

	if (toggled) {
		sidebar.removeAttribute("style");
		content.removeAttribute("style");
		/*
		sidebar.style.width = 0 + "%";
		sidebar.style.position = "relative";
		content.style.width = 100 + "%";
		*/
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


function initMap() {
  // Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		scrollwheel: true,
		zoom: 8
	});
}



