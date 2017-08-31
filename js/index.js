/*jslint browser: true*/
/*global mapboxgl*/

//-----------------------------------------------------------------------

var mapboxgl = mapboxgl || {
	Map: function () {
		'use strict';

		return {
			on: function () {
			}
		};
	}
};

//-----------------------------------------------------------------------

mapboxgl.accessToken = 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiJjajBoN3hzZGwwMDJsMnF0YW96Y2l3OGk2In0._5BdojVYvNuR6x4fQNYZrA';
var baseURI = 'https://tursics.github.io/map-krefeld',
	appName = 'Krefeld-Karte';

//-----------------------------------------------------------------------

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9', //streets-v9 outdoors-v9 light-v9 dark-v9 satellite-v9 satellite-streets-v9
	center: [6.559, 51.334],
	minZoom: 10,
	maxZoom: 19,
	zoom: 16,
	pitch: 60,
	hash: true,
	maxBounds: [[6.4, 51.22], [6.8, 51.46]]
});
var layerIDs = [];

//-----------------------------------------------------------------------

function getDataSources() {
	'use strict';

	var sources = [
		{
			title: 'Stadt Krefeld',
			layer: 'VERWALT_EINH',
			icon: 'border'
		},
		{
			title: 'Liegenschaftskataster Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/liegenschaftskataster-stadt-krefeld'
		},
		{
			title: 'Straßenverzeichnis 12/2016 der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/strabenverzeichnis-12-2016-der-stadt-krefeld'
		},
		{
			title: 'Familienkarte der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/familienkarte-der-stadt-krefeld'
		},
		{
			title: 'Integrationsangebote der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/integrationsangebote-der-stadt-krefeld'
		},
		{
			title: 'Flüchtlingshilfe bei der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/fluchtlingshilfe-bei-der-stadt-krefeld'
		},
		{
			title: 'Familienkalender der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/familienkalender-der-stadt-krefeld'
		},
		{
			title: 'Interkultureller Kalender der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/interkultureller-kalender-der-stadt-krefeld'
		},
		{
			title: 'Bildungspaket in Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/bildungspaket'
		},
		{
			title: 'Kindergärten',
			layer: 'kindergartens',
			icon: 'kindergarten'
		},
		{
			title: 'Schulen',
			layer: 'schools',
			icon: 'school'
		},
		{
			title: 'Hotels',
			layer: 'hotels',
			icon: 'hotel'
		},
		{
			title: 'Restaurants',
			layer: 'restaurants',
			icon: 'restaurant'
		},
		{
			title: 'Verwaltung',
			layer: 'administration',
			icon: 'town-hall'
		},
		{
			title: 'Veranstaltungskalender der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/veranstaltungskalender-der-stadt-krefeld'
		},
		{
			title: 'Migrantenselbstorganisationen in der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/migrantenselbstorganisationen-in-der-stadt-krefeld'
		},
		{
			title: 'Familienkompass der Stadt Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/familienkompass-der-stadt-krefeld'
		},
		{
			title: 'Wohnungsangebot in Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/wohnungsangebot-in-krefeld'
		}
	];

	return sources;
}

//-----------------------------------------------------------------------

function loadGeoJSON(title, url, titleTemplate, icon, filter) {
	'use strict';

	if (!map.getSource(title)) {
		map.addSource(title, {
			type: 'geojson',
			data: url
		});
	}

	if (!map.getLayer(title)) {
		map.addLayer({
			id: title,
			type: 'symbol',
			source: title,
			visibility: 'none',
			filter: filter,
			layout: {
				'icon-image': icon,
				'icon-size': 2,
				'text-field': titleTemplate,
				'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
				'text-offset': [0, 0.6],
				'text-anchor': 'top'
			},
			paint: {
				'text-color': '#444',
				'text-halo-color': '#fff',
				'text-halo-width': 1
			}
		});
		map.setLayoutProperty(title, 'visibility', 'none');

		layerIDs.push(title);
	}
}

//-----------------------------------------------------------------------

function loadGeoJSONLine(title, url) {
	'use strict';

	if (!map.getSource(title)) {
		map.addSource(title, {
			type: 'geojson',
			data: url
		});
	}

	if (!map.getLayer(title)) {
		map.addLayer({
			id: title,
			type: 'fill',
			source: title,
			visibility: 'none',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': '#888',
				'line-width': 8
			}
		});
		map.setLayoutProperty(title, 'visibility', 'none');
	}
}

//-----------------------------------------------------------------------

function loadGeoJSONPolygon(title, url) {
	'use strict';

	if (!map.getSource(title)) {
		map.addSource(title, {
			type: 'geojson',
			data: url
		});
	}

	if (!map.getLayer(title)) {
		map.addLayer({
			id: title,
			type: 'fill',
			source: title,
			visibility: 'none',
			layout: {},
			paint: {
				'fill-color': '#f00',
				'fill-opacity': 0.05
			}
		});
		map.setLayoutProperty(title, 'visibility', 'none');
	}
}

//-----------------------------------------------------------------------

function loadData() {
	'use strict';

	// https://github.com/mapbox/mapbox-gl-styles#standard-icons
	loadGeoJSON('schools', baseURI + '/map/schulen.json', '{title}', 'school-15', ['!=', 'title', '']);
	loadGeoJSON('kindergartens', baseURI + '/map/kindergartens.json', '{title}', 'playground-15', ['!=', 'title', '']);
	loadGeoJSON('restaurants', baseURI + '/map/hotels.json', '{title}', 'restaurant-15', ['==', 'restaurant', true]);
	loadGeoJSON('hotels', baseURI + '/map/hotels.json', '{title}', 'lodging-15', ['==', 'hotel', true]);
	loadGeoJSONPolygon('VERWALT_EINH', baseURI + '/map/ALKIS_ADV_SHAPE_Krefeld_VERWALT_EINH.json');

	loadGeoJSON('administration', baseURI + '/map/administration.json', '{title}', 'town-hall-15', ['!=', 'title', '']);
/*	loadGeoJSON('schools', baseURI + '/map/administrationothers.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/celltowers.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/cemetery.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/chapels.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/churcheothers.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/churches.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/culture.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/cultureothers.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/disabledfleets.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/disabledothers.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/dogwastebags.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/firestations.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/gymnasiums.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/hospitals.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/hotels.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/icerinks.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/kindergartens.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/libraries.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/museums.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/parking.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/parks.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/playgrounds.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/pois.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/policestations.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/schools.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/schoolsothers.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/seniors.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/sportsfields.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/swimmingbaths.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/theaters.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/universities.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/youthcenter.json', '{title}', 'school-15', []);
	*/
}

//-----------------------------------------------------------------------

function menuClick(event) {
//	'use strict';

	var layer = this.layerName,
		visibility;

	event.preventDefault();
	event.stopPropagation();

	visibility = map.getLayoutProperty(layer, 'visibility');

	if (visibility === 'visible') {
		map.setLayoutProperty(layer, 'visibility', 'none');
		this.className = this.className.substr(0, this.className.indexOf(' active'));
	} else {
		this.className += ' active';
		map.setLayoutProperty(layer, 'visibility', 'visible');
	}
}

//-----------------------------------------------------------------------
/*
function changeMapStyle(event) {
	'use strict';

	event.preventDefault();
	event.stopPropagation();

    map.setStyle('mapbox://styles/mapbox/satellite-v9');
	loadData();
}
*/
//-----------------------------------------------------------------------

function filterKeyUp(event) {
	'use strict';

	// https://www.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
	// https://www.mapbox.com/mapbox-gl-js/example/filter-markers-by-input/

//	var value = event.target.value.trim().toLowerCase();
//	layerIDs.forEach(function (layerID) {
//		map.setLayoutProperty(layerID, 'visibility', layerID.indexOf(value) > -1 ? 'visible' : 'none');
//	});
}

//-----------------------------------------------------------------------

function getJSON(uri, callback) {
	'use strict';

	var request = new XMLHttpRequest();
	request.open('GET', uri, true);
	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			callback(data);
		} else {
			callback(null);
		}
	};
	request.onerror = function () {
		callback(null);
	};
	request.send();
}

//-----------------------------------------------------------------------

function setCallbacksToMenu() {
	'use strict';

	function onClickMenuCB(e) {
		var menu = document.getElementsByClassName('dropdown-toggle'),
			i,
			menuShown = false;

		for (i = 0; i < menu.length; ++i) {
			if (menu[i] === e.target) {
				if (menu[i].parentNode.classList.length === 2) {
					menu[i].parentNode.classList = ['dropdown'];
				} else {
					menu[i].parentNode.classList = ['dropdown open'];
					menuShown = true;
				}
			} else {
				menu[i].parentNode.classList = ['dropdown'];
			}
		}

		menu = document.getElementById('pagecover');
		menu.classList = [menuShown ? 'open' : ''];
	}

	function onClickSubMenu(obj) {
		var layer = obj.dataset.id,
			visibility = map.getLayoutProperty(layer, 'visibility');

		if (visibility === 'visible') {
			map.setLayoutProperty(layer, 'visibility', 'none');
			obj.className = obj.className.substr(0, obj.className.indexOf(' active'));
		} else {
			obj.className += ' active';
			map.setLayoutProperty(layer, 'visibility', 'visible');
		}
	}

	function onClickSubMenuCB(e) {
		var menu = document.getElementsByClassName('dropdown-toggle'),
			i,
			obj;

		for (i = 0; i < menu.length; ++i) {
			menu[i].parentNode.classList = ['dropdown'];
		}

		menu = document.getElementById('pagecover');
		menu.classList = [''];

		obj = e.target;
		if (obj.className.indexOf('submenu') === -1) {
			obj = e.target.parentNode;
		}

		onClickSubMenu(obj);
	}

	var div = document.getElementsByClassName('dropdown-toggle'),
		i;

	for (i = 0; i < div.length; ++i) {
//		div[i].onclick = onClickMenuCB;
		div[i].onmousedown = onClickMenuCB;
	}

	div = document.getElementsByClassName('submenu');
	for (i = 0; i < div.length; ++i) {
		div[i].onmousedown = onClickSubMenuCB;
	}

//	div = document.getElementById('headerbar');
//	div.onmousedown = onClickMenuCB;

	div = document.getElementById('pagecover');
	div.onmousedown = onClickMenuCB;
}

//-----------------------------------------------------------------------

function buildNavigationAsync(data) {
	'use strict';

	var navbar = document.getElementsByClassName('navbar-collapse'),
		d,
		m,
		str = '';

	data = data || [];
	str += '<ul class="nav navbar-nav">';

	for (d = 0; d < data.length; ++d) {
		str += '<li class="dropdown">';
		str += '<a class="dropdown-toggle" href="#">' + data[d].title + '</a>';
		str += '<ul class="dropdown-menu">';

		data[d].menu = data[d].menu || [];

		for (m = 0; m < data[d].menu.length; ++m) {
			data[d].menu[m].title = data[d].menu[m].title || '';
			data[d].menu[m].id = data[d].menu[m].id || '';
			data[d].menu[m].icon = data[d].menu[m].icon || 'marker';

			str += '<li><a href="#" class="submenu icon ' + data[d].menu[m].icon + '-15" data-id="' + data[d].menu[m].id + '"><i class="icon" style="background-image:url(node_modules/mapbox-gl-styles/sprites/bright-v9/_svg/' + data[d].menu[m].icon + '-15.svg);"></i>' + data[d].menu[m].title + '</a></li>';
		}

		str += '</ul>';
		str += '</li>';
	}

	str += '</ul>';

	navbar[0].innerHTML = str;

	setCallbacksToMenu();
}

//-----------------------------------------------------------------------

function buildNavigation() {
	'use strict';

	var headerbar = document.getElementById('headerbar'),
		str = '';

	str += '<div class="fluid">';

	str += '<div class="navbar-header">';
	str += '<a class="navbar-brand" href="index.html">' + appName + '</a>';
	str += '</div>';

	str += '<div class="navbar-collapse">';
	str += '</div>';

	str += '</div>';

	headerbar.innerHTML = str;

	getJSON('map/menu.json', function (data) {
		buildNavigationAsync(data);
	});
}

//-----------------------------------------------------------------------
/*
function buildMenu() {
	'use strict';

	var sources = getDataSources(),
		i,
		elem,
		omnibox = document.getElementById('omnibox');

	elem = document.createElement('input');
	elem.type = 'text';
	elem.name = 'filter';
	elem.id = 'filter';
	elem.placeholder = 'In Krefeld suchen';
	omnibox.appendChild(elem);

	for (i = 0; i < sources.length; ++i) {
		if (typeof sources[i].layer !== 'undefined') {
			elem = document.createElement('a');
			elem.href = '#';
//			elem.className = 'active';
			elem.textContent = sources[i].title;
			elem.layerName = sources[i].layer;
			elem.onclick = menuClick;

			if (typeof sources[i].icon !== 'undefined') {
				elem.className = 'icon ' + sources[i].icon;
			}

			omnibox.appendChild(elem);
		}
	}

//	elem = document.createElement('a');
//	elem.href = '#';
//	elem.textContent = 'Satellit anzeigen';
//	elem.id = 'mapstyle';
//	elem.onclick = changeMapStyle;
//	omnibox.appendChild(elem);

	elem = document.getElementById('filter');
	elem.focus();
	elem.addEventListener('keyup', filterKeyUp);
}
*/
//-----------------------------------------------------------------------

map.on('load', function () {
	'use strict';

	if (window.location.href.indexOf('file://') === 0) {
		baseURI = '.';
	}

	map.addControl(new mapboxgl.NavigationControl());
	map.addControl(new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true
		}
	}));
	map.addControl(new mapboxgl.ScaleControl({
		maxWidth: 200,
		unit: 'metric'
	}));
	map.addControl(new mapboxgl.FullscreenControl());

	// http://www.color-hex.com/color/637cb0
	map.setPaintProperty('water', 'fill-color', '#96a7ca');
	map.setPaintProperty('building', 'fill-color', '#f4eaed');
	map.setPaintProperty('park', 'fill-color', '#a7ca96');

	loadData();
//	buildMenu();

	// next step:
	// https://www.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
	// https://github.com/mapbox/mapbox-gl-styles
	// https://www.krefeld.de/de/vermessung/stadtkarten/
	// https://www.krefeld.de/de/dienstleistungen/stadtkarte-von-krefeld-im-geoportal-niederrhein/
});

//-----------------------------------------------------------------------

buildNavigation();

//-----------------------------------------------------------------------
