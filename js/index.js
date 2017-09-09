/*jslint browser: true*/
/*global mapboxgl*/

//-----------------------------------------------------------------------

var mapboxgl = mapboxgl || {
	Map: function () {
		'use strict';

		return {
			on: function () {
			},
			getLayer: function () {
				return false;
			},
			getSource: function () {
				return false;
			},
			addLayer: function () {},
			addImage: function () {},
			addSource: function () {},
			setLayoutProperty: function () {},
			loadImage: function (foo, callback) {
				callback('mapbox gl not loaded');
			}
		};
	}
};

//-----------------------------------------------------------------------

mapboxgl.accessToken = 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiJjajBoN3hzZGwwMDJsMnF0YW96Y2l3OGk2In0._5BdojVYvNuR6x4fQNYZrA';
var baseURI = 'https://tursics.github.io/map-krefeld',
	appName = 'Krefeld-Karte',
	fontawesomePath = './assets/fontawesome/';

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
//var layerIDs = [];

//-----------------------------------------------------------------------
/*
title: 'Liegenschaftskataster Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/liegenschaftskataster-stadt-krefeld'

title: 'Straßenverzeichnis 12/2016 der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/strabenverzeichnis-12-2016-der-stadt-krefeld'

title: 'Familienkarte der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/familienkarte-der-stadt-krefeld'

title: 'Integrationsangebote der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/integrationsangebote-der-stadt-krefeld'

title: 'Flüchtlingshilfe bei der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/fluchtlingshilfe-bei-der-stadt-krefeld'

title: 'Familienkalender der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/familienkalender-der-stadt-krefeld'

title: 'Interkultureller Kalender der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/interkultureller-kalender-der-stadt-krefeld'

title: 'Bildungspaket in Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/bildungspaket'

title: 'Veranstaltungskalender der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/veranstaltungskalender-der-stadt-krefeld'

title: 'Migrantenselbstorganisationen in der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/migrantenselbstorganisationen-in-der-stadt-krefeld'

title: 'Familienkompass der Stadt Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/familienkompass-der-stadt-krefeld'

title: 'Wohnungsangebot in Krefeld',
portalURI: 'https://www.offenesdatenportal.de/dataset/wohnungsangebot-in-krefeld'
*/
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
		map.loadImage(fontawesomePath + icon + '.png', function (error, image) {
			map.addImage(icon, image);
			map.addLayer({
				id: title,
				type: 'symbol',
				source: title,
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
		});

//		layerIDs.push(title);
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
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': '#888',
				'line-width': 8
			}
		});
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
			layout: {},
			paint: {
				'fill-color': '#f00',
				'fill-opacity': 0.05
			}
		});
	}
}

//-----------------------------------------------------------------------
/*
function loadData() {
	'use strict';

	// https://github.com/mapbox/mapbox-gl-styles#standard-icons
	loadGeoJSON('restaurants', baseURI + '/map/hotels.json', '{title}', 'restaurant-15', ['==', 'restaurant', true]);
	loadGeoJSON('hotels', baseURI + '/map/hotels.json', '{title}', 'lodging-15', ['==', 'hotel', true]);
	loadGeoJSONPolygon('VERWALT_EINH', baseURI + '/map/ALKIS_ADV_SHAPE_Krefeld_VERWALT_EINH.json');

	loadGeoJSON('schools', baseURI + '/map/administrationothers.json', '{title}', 'school-15', []);
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
	loadGeoJSON('schools', baseURI + '/map/gymnasiums.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/hospitals.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/hotels.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/icerinks.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/kindergartens.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/museums.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/parking.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/parks.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/pois.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/schools.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/schoolsothers.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/seniors.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/theaters.json', '{title}', 'school-15', []);
	loadGeoJSON('schools', baseURI + '/map/youthcenter.json', '{title}', 'school-15', []);
}
*/
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
/*
function filterKeyUp(event) {
	'use strict';

	// https://www.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
	// https://www.mapbox.com/mapbox-gl-js/example/filter-markers-by-input/

//	var value = event.target.value.trim().toLowerCase();
//	layerIDs.forEach(function (layerID) {
//		map.setLayoutProperty(layerID, 'visibility', layerID.indexOf(value) > -1 ? 'visible' : 'none');
//	});
}
*/
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

function getMenuItemSnippet(data, level1, level2) {
	'use strict';

	return '<i class="icon" style="background-image:url(' + fontawesomePath + data[level1].menu[level2].icon + '.svg);"></i>' + data[level1].menu[level2].title;
}

//-----------------------------------------------------------------------

function getMenuItemSnippetLoading(data, level1, level2) {
	'use strict';

	return '<i class="icon spinning1" style="background-image:url(' + fontawesomePath + 'circle-o-notch.svg);"></i>' + data[level1].menu[level2].title;
}

//-----------------------------------------------------------------------

function getMenuItemSnippetLoaded(data, level1, level2) {
	'use strict';

	return '<i class="icon spinning2" style="background-image:url(' + fontawesomePath + 'circle-o-notch.svg);"></i>' + data[level1].menu[level2].title;
}

//-----------------------------------------------------------------------

function getMenuLinkSnippet(data, level1, level2) {
	'use strict';

	data[level1].menu[level2].title = data[level1].menu[level2].title || '';
	data[level1].menu[level2].id = data[level1].menu[level2].id || '';
	data[level1].menu[level2].icon = data[level1].menu[level2].icon || 'marker';
	data[level1].menu[level2].color = data[level1].menu[level2].color || '#000000';

	return '<a href="#" class="submenu" ' +
		'data-id="' + data[level1].menu[level2].id + '" ' +
		'data-icon="' + data[level1].menu[level2].icon + '" ' +
		'data-type="' + data[level1].menu[level2].type + '" ' +
		'data-level1="' + level1 + '" ' +
		'data-level2="' + level2 + '" ' +
		'style="background-color:' + data[level1].menu[level2].color + '00;">' +
		getMenuItemSnippet(data, level1, level2) + '</a>';
}

//-----------------------------------------------------------------------

function setCallbacksToMenu(data) {
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
			icon = obj.dataset.icon,
			visibility = false,
			backgroundColor = obj.style.backgroundColor.split(',');

		if (map.getLayer(layer)) {
			visibility = map.getLayoutProperty(layer, 'visibility');

			if (visibility !== 'none') {
				map.setLayoutProperty(layer, 'visibility', 'none');
				obj.className = obj.className.substr(0, obj.className.indexOf(' active'));
				backgroundColor[3] = ' 0)';
				obj.style.backgroundColor = backgroundColor.join(',');
			} else {
				obj.className += ' active';
				map.setLayoutProperty(layer, 'visibility', 'visible');
				backgroundColor[3] = ' .99)';
				obj.style.backgroundColor = backgroundColor.join(',');
			}
		} else {
			obj.innerHTML = getMenuItemSnippetLoading(data, obj.dataset.level1, obj.dataset.level2);
			obj.className += ' active';
//			map.setLayoutProperty(layer, 'visibility', 'visible');
			backgroundColor[3] = ' .99)';
			obj.style.backgroundColor = backgroundColor.join(',');

			if ('polygon' === obj.dataset.type) {
				loadGeoJSONPolygon(layer, baseURI + '/map/' + layer + '.json', '{title}', icon, ['!=', 'title', '']);
			} else {
				loadGeoJSON(layer, baseURI + '/map/' + layer + '.json', '{title}', icon, ['!=', 'title', '']);
			}
		}
	}

	function onClickSubMenuCB(e) {
		var menu = document.getElementsByClassName('dropdown-toggle'),
			i,
			obj;

/*		for (i = 0; i < menu.length; ++i) {
			menu[i].parentNode.classList = ['dropdown'];
		}

		menu = document.getElementById('pagecover');
		menu.classList = [''];*/

		obj = e.target;
		if (obj.className.indexOf('submenu') === -1) {
			obj = e.target.parentNode;
		}

		onClickSubMenu(obj);
	}

	function loadingData(e) {
		if (e.isSourceLoaded && ('sourcedata' === e.type)) {
			var elems = document.querySelectorAll('[data-id="' + e.sourceId + '"]'),
				backgroundColor,
				obj;

			if (elems.length > 0) {
				obj = elems[0];
				if ('undefined' === typeof e.coord) {
					obj.innerHTML = getMenuItemSnippetLoaded(data, obj.dataset.level1, obj.dataset.level2);
				} else {
					obj.innerHTML = getMenuItemSnippet(data, obj.dataset.level1, obj.dataset.level2);
				}
			}
		}
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

	map.on('sourcedata', loadingData);
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
			data[d].menu[m].color = data[d].menu[m].color || '#000000';

			str += '<li>' + getMenuLinkSnippet(data, d, m) + '</li>';
		}

		str += '</ul>';
		str += '</li>';
	}

	str += '</ul>';

	navbar[0].innerHTML = str;

	setCallbacksToMenu(data);
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

//	loadData();

	// next step:
	// https://www.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
	// https://github.com/mapbox/mapbox-gl-styles
	// https://www.krefeld.de/de/vermessung/stadtkarten/
	// https://www.krefeld.de/de/dienstleistungen/stadtkarte-von-krefeld-im-geoportal-niederrhein/
});

//-----------------------------------------------------------------------

buildNavigation();

//-----------------------------------------------------------------------
