
	var map;
	var markers = [];

	//load map
	function init() {
		var myOptions = {
			zoom: 12,
			center: { lat: 42.353350, lng: -71.091525 },
			mapId: '1a19e8c6aa7aeda8',
		};
		var element = document.getElementById('map');
		map = new google.maps.Map(element, myOptions);
		addMarkers();
	}

	//add bus markers to map
	async function addMarkers() {
		// get bus data
		var locations = await getBusLocations();

		//loop through data, add bus markers
		locations.forEach(function (bus) {
			var marker = getMarker(bus.id);
			if (marker) {
				moveMarker(marker, bus);
			}
			else {
				addMarker(bus);
			}
		});

		//timer
		console.log(new Date());
		setTimeout(addMarkers, 15000);
	}

	// Request bus data from MBTA
	async function getBusLocations() {
		var url = 'https://api-v3.mbta.com/vehicles?filter[route]=39&include=trip';
		var response = await fetch(url);
		var json = await response.json();
		return json.data;
	}

	function addMarker(bus) {
		var icon = getIcon(bus);
		var marker = new google.maps.Marker({
			position: {
				lat: bus.attributes.latitude,
				lng: bus.attributes.longitude
			},
			map: map,
			icon: icon,
			id: bus.id
		});
		markers.push(marker);
	}

	function getIcon(bus) {
		if (bus.attributes.direction_id === 0) {
			return 'red.png';
		}
		return 'blue.png';
	}

	function moveMarker(marker, bus) {
		//change icon if bus has changed direction
		var icon = getIcon(bus);
		marker.setIcon(icon);

		// move icon to new lat/long
		marker.setPosition({
			lat: bus.attributes.latitude,
			lng: bus.attributes.longitude
		});
	}

	function getMarker(id) {
		var marker = markers.find(function (item) {
			return item.id === id;
		});
		return marker;
	}

	window.onload = init;
