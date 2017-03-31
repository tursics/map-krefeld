/*jslint browser: true*/
/*global mapboxgl*/

//-----------------------------------------------------------------------

mapboxgl.accessToken = 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiJjajBoN3hzZGwwMDJsMnF0YW96Y2l3OGk2In0._5BdojVYvNuR6x4fQNYZrA';
var baseURI = 'https://tursics.github.io/map-krefeld';

//-----------------------------------------------------------------------

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9', //streets-v9 outdoors-v9 light-v9 dark-v9 satellite-v9 satellite-streets-v9
	center: [6.559, 51.334],
	minZoom: 11,
	maxZoom: 19,
	zoom: 16,
	pitch: 60,
	hash: true
//	maxBounds: If set, the map will be constrained to the given bounds
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
			title: 'Kindertages- und Jugendeinrichtungen in Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/kindertageseinrichtungen-und-jugendeinrichtungen'
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

function filterKeyUp(event) {
	'use strict';

	// If the input value matches a layerID set
	// it's visibility to 'visible' or else hide it.
//	var value = event.target.value.trim().toLowerCase();
//	layerIDs.forEach(function (layerID) {
//		map.setLayoutProperty(layerID, 'visibility', layerID.indexOf(value) > -1 ? 'visible' : 'none');
//	});
}

//-----------------------------------------------------------------------

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

	elem = document.getElementById('filter');
	elem.focus();
	elem.addEventListener('keyup', filterKeyUp);
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
	map.setPaintProperty('water', 'fill-color', '#637cb0');
	map.setPaintProperty('building', 'fill-color', '#b0637c');
	map.setPaintProperty('park', 'fill-color', '#7cb063');

	// https://github.com/mapbox/mapbox-gl-styles#standard-icons
	loadGeoJSON('schools', baseURI + '/map/schulen.json', '{title}', 'school-15', ['!=', 'title', '']);
	loadGeoJSON('restaurants', baseURI + '/map/hotels.json', '{title}', 'restaurant-15', ['==', 'cat1', 'Gastronomie']);
	loadGeoJSON('hotels', baseURI + '/map/hotels.json', '{title}', 'lodging-15', ['==', 'cat1', 'Hotel']);
	loadGeoJSONPolygon('VERWALT_EINH', baseURI + '/map/ALKIS_ADV_SHAPE_Krefeld_VERWALT_EINH.json');
	buildMenu();

	// next step:
	// https://www.mapbox.com/mapbox-gl-js/example/setstyle/
	// https://github.com/mapbox/mapbox-gl-styles
	// https://www.krefeld.de/de/vermessung/stadtkarten/
	// https://www.krefeld.de/de/dienstleistungen/stadtkarte-von-krefeld-im-geoportal-niederrhein/
});
