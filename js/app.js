//	Global list of listings - used inside and outside of knockout
var GLOBAL = [];

//	Global markers
var MARKERS = [];

//	Global map, no pun intended
var MAP;

//	Global viewmodel
var VM;

//	Google places key
var KEY = 'AIzaSyDkG8todDRXl--0ThEqN8Ch0VHowbd4Fow';

//	Shows listing details, retrieves via API/AJAX
function listingDetails(id,marker) {

	// Switch depending on focus method (click result versus click marker)
	if (marker == true) {
		lid = id;
	} else {
		lid = $(id).find('span').attr('data-id');
	}
	listing = GLOBAL[lid];
	
	// Centers map on selected item
	$(MARKERS).each(function() {
	
		if (this.gid == lid) {
			MAP.setCenter(this.getPosition());
		}
	
	});
	
	// Default loading message
	$('#details').html('Loading result ...');
	
	req = { placeId: lid };
	result = {
		name: listing.name,
		address: '',
		phone: '',
		ratings: 0
	}
	
	// Grabs info from google places
	detail = new google.maps.places.PlacesService(MAP);
	detail.getDetails(req, function(pl,status) {
		console.log(pl);
		result.address = pl.formatted_address;
		result.phone = 	pl.international_phone_number;
		result.rating = pl.rating;
		result.ratings = pl.user_ratings_total;
		result.url = pl.url;
			
		element = $('<div/>').attr({id:'result-detail'});
		pref = $('<div/>').attr({id:'result-attribution'}).html('Details from Google Places').appendTo(element);
		name = $('<div/>').attr({id:'result-name'}).html(result.name).appendTo(element);	
		addr = $('<div/>').attr({id:'result-addr'}).html(result.address).appendTo(element);	
		phone = $('<div/>').attr({id:'result-phone'}).html(result.phone).appendTo(element);	
		note = $('<div/>').attr({id: 'result-note'}).html('<strong>Note from Nathan:</strong> ' + listing.description).appendTo(element);
		$('#details').html( element );		
		
	});
	

};

// Initializes map
function initialize() {
	var mapOptions = {
		center: { lat: 27.9710, lng: -82.4650},
		zoom: 12
	};
	

	
	MAP = new google.maps.Map(document.getElementById('map'), mapOptions);
	VM.filter();
}

/*
	Now provides feedback if google maps cannot be accessed
	- Response to instructor feedback
*/
if (typeof(google) == 'undefined' ) {
	alert('Error: Google Maps requires that this page be run via HTTP protocol.  The map will also fail if Google Maps\' API is blocked via firewall or otherwise cannot be accessed.  To run (with Python installed), run python -m SimpleHTTPServer at the command line.');
}

google.maps.event.addDomListener(window, 'load', initialize);


//	sizes map to viewport, also called on window resize
function mapSize() {

	var viewHeight = $(window).height();
	
	$('#container').css('height',viewHeight);
}

// Document ready
$(function() {

	$(window).resize(function() {
		mapSize();
	});
	mapSize();
});


// My knockout model
function AppViewModel() {
	// set default search
	this.search = "";

	// set default result count (not implemented)
	this.resultCountText = '';
	
	// overall listings and initialized filtered listings
	this.filteredListings = ko.observableArray();
	
	// Our listings dataset - these will be compared against searches to create filteredListings
    this.listings = [
	
		{ name: 'Ciccio\'s / Water', type: 'restaurant', latitude: 27.933003, longitude: -82.43498, description:'A good South Tampa restaurant.', gid: 'ChIJ1QC_BmfDwogR36lcy65TiYw' },
		{ name: 'Columbia Restaurant', type: 'restaurant', latitude: 27.959985, longitude: -82.483135, description:'A Tampa institution for Cuban food and atmosphere.', gid: 'ChIJz8e7TVLEwogRBeybvscHnD4' },		
		{ name: 'Tropicana Field', type: 'sports', latitude: 27.768225, longitude: -82.653392, description:'The place to watch The Rays lose baseball games.', gid: 'ChIJNbq0nlHEwogRNo_UqkajMgY' },
		{ name: 'International Mall', type: 'mall', latitude: 27.964627, longitude: -82.520601, description:'A regional hub for high-class shopping and dining.', gid: 'ChIJRw58qlbCwogR_XLzmeSd6pU' },		
		{ name: 'Lake Park', type: 'park', latitude: 28.118885, longitude: -82.503101, description:'Quiet park representative of North Tampa', gid: 'ChIJ_dAhYRO_wogRIHLI3Xkxn-w' },	
		
		{ name: 'University of South Florida', type: 'university', latitude: 28.058703, longitude: -82.413854, description:'Tampa\'s largest university.', gid: 'ChIJ0__Gw77HwogRapBRXB509LE' },	
		{ name: 'The Florida Aquarium', type: 'attraction', latitude: 27.944228, longitude: -82.445177, description:'A world-class aquarium near the Channelside District', gid: 'ChIJ-8n8yfDEwogRSwgt9QrDaJk' },
		{ name: 'Busch Gardens', type: 'attraction', latitude: 28.036352, longitude: -82.42245699999999, description:'A wonderful zoo and theme park.', gid: 'ChIJ41PqwVHGwogRG-SnXjgUAbs' },
		{ name: 'Lowry Park Zoo', type: 'attraction', latitude: 28.073372, longitude: -82.58746600000001, description:'Great family-friendly zoo.', gid: 'ChIJi0v1SerqwogRyybqMMLVnIo' },	
		{ name: 'Ybor City', type: 'entertainment', latitude: 27.9650212, longitude: -82.4350941, description:'Tampa\s nightlife center.', gid: 'ChIJ93BiRQTFwogR9PaXslO5jpU' },
		{ name: 'Channelside', type: 'entertainment', latitude: 27.942856, longitude: -82.447316, description:'A scaled-down version of Ybor.', gid: 'ChIJaT3tefHEwogRR95KBxBYaYc' },	
		{ name: 'St. Pete Beach', type: 'beach', latitude: 27.724722, longitude: -82.74194399999999, description:'My favorite beach.', gid: 'ChIJqd7lnZ8Cw4gRaoxvcsn8qpg' },
		{ name: 'Clearwater Beach', type: 'beach', latitude: 27.9775301, longitude: -82.82708459999999, description:'A lot of tourist\'s favorite beach. :p', gid: 'ChIJ1cDhykjpwogREp_rKAt6oqI' },
		{ name: 'University of Tampa', type: 'university', latitude: 27.947488, longitude: -82.46717200000001, description:'A smaller institution with a beautiful campus in downtown Tampa', gid: 'ChIJ90AFeYbEwogR2VUs2R8iu0s' },			
	];
	
	// this alias
	var self = this;
	
	// Invokes displayListings function through filter() with a reset
	this.displayListings = function() {

		self.filter(true);
		return true;
	};
	
	// Translates listings into global variables for use outside of KO
	this.globalizeListings = function() {
		$(self.listings).each(function(iterator,listing) {
			GLOBAL[listing.gid] = listing;
		});
	};
	
	// The primary search mechanism - filtered listings are listings that match a regex
	this.filter = function(reset) {
		
		// Convert search to regex so matching can happen
		srch = new RegExp(self.search,'gi');
		if (srch == '') {
			srch = new RegExp("c",'gi');
		}
		
		// Clearout existing filtered items
		self.filteredListings.removeAll();

		// Remove existing markers for reset
		for(i=0;i<MARKERS.length;i++) {

			MARKERS[i].setMap(null);

		}
		
		// Instantiate markers & infowindows and reset details
		$('#details').html( '' );	
		MARKERS = [];
		INFOWINDOWS = [];
		var bounds =  new google.maps.LatLngBounds();

		// Examine each item to see if it matches the search criterion
		$(self.listings).each(function() {
			// If an item matches, create a new marker and associated infowindow
			if (this.name.match(srch)) {
				self.filteredListings.push(this);
				mlatlng = new google.maps.LatLng(this.latitude, this.longitude);
				mrk = new google.maps.Marker({
					position: mlatlng,
					title:this.name
				});
				mrk.bpos = mlatlng;
				mrk.gid = this.gid;
				MARKERS.push(mrk);
				INFOWINDOWS.push(new google.maps.InfoWindow({ content: this.name }));
				bounds.extend(mlatlng);

			}
		});
	
		// The listeners for click on map items, which open up the associated infowindow
		for(i=0;i<MARKERS.length;i++) {

			MARKERS[i].setMap(MAP);

			  google.maps.event.addListener(MARKERS[i], 'click', function(innerKey) {
				  return function() {
					MAP.setCenter(MARKERS[innerKey].getPosition());
					listingDetails(MARKERS[innerKey].gid,true);
					INFOWINDOWS[innerKey].open(MAP, MARKERS[innerKey]);
				  }
				}(i));
		}
		
		// If there are matches, invoke the fitBounds() function to get closest view
		if (self.filteredListings().length > 0 && reset == true) {
			MAP.fitBounds(bounds);
		}
		

	};	

	
	// Run a default filter and globalize any search match items.  By default this will match all * items.
	this.globalizeListings();	
	this.filter(false);

}

// Activates knockout.js
VM = new AppViewModel();
ko.applyBindings(VM);