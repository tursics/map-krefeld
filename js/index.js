/*jslint browser: true*/
/*global mapboxgl*/

//-----------------------------------------------------------------------

mapboxgl.accessToken = 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiJjajBoN3hzZGwwMDJsMnF0YW96Y2l3OGk2In0._5BdojVYvNuR6x4fQNYZrA';
var baseURI = 'https://tursics.github.io/map-krefeld';

//-----------------------------------------------------------------------

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9', //streets-v9 outdoors-v9 light-v9 dark-v9 satellite-v9 satellite-streets-v9
	center: [6.643, 51.451],
	minZoom: 10,
	maxZoom: 19,
	zoom: 16,
	pitch: 60,
	hash: true
//	maxBounds: If set, the map will be constrained to the given bounds
});

//-----------------------------------------------------------------------

function getDataSources() {
	'use strict';

	var sources = [
		{
			title: 'Stadt Krefeld',
			layer: 'VERWALT_EINH',
			portalURI: 'https://www.offenesdatenportal.de/dataset/liegenschaftskataster-stadt-krefeld'
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
			title: 'Schulen in der Stadt Krefeld',
			layer: 'schools',
			portalURI: 'https://www.offenesdatenportal.de/dataset/https-www-krefeld-de-www-schulen-nsf-apijson-xsp-view-list-az-compact-false',
			dataURI: 'site=https://www.krefeld.de/www/schulen.nsf/apijson.xsp/view-list-az',
			betterURI: 'moerser.tursics.de?site=https://www.krefeld.de/www/schulen.nsf/apijson.xsp/view-list-az'
		},
		{
			title: 'Hotels und Restaurants in Krefeld',
			portalURI: 'https://www.offenesdatenportal.de/dataset/hotels-und-restaurants-in-krefeld'
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
		this.className = '';
	} else {
		this.className = 'active';
		map.setLayoutProperty(layer, 'visibility', 'visible');
	}
}

//-----------------------------------------------------------------------

function buildMenu() {
	'use strict';


	var sources = getDataSources(),
		i,
		link,
		layers;

	for (i = 0; i < sources.length; ++i) {
		if (typeof sources[i].layer !== 'undefined') {
			link = document.createElement('a');
			link.href = '#';
//			link.className = 'active';
			link.textContent = sources[i].title;
			link.layerName = sources[i].layer;

			link.onclick = menuClick;

			layers = document.getElementById('menu');
			layers.appendChild(link);
		}
	}
}

//-----------------------------------------------------------------------

function loadGeoJSON(title, url) {
	'use strict';

	map.addSource(title, {
		type: 'geojson',
		data: url
	});

	map.addLayer({
		id: title,
		type: 'symbol',
		source: title,
		visibility: 'none',
		layout: {
			'icon-image': 'ice-cream-15',
			'icon-size': 2,
			'text-field': '{DocName}',
			'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
			'text-offset': [0, 0.6],
			'text-anchor': 'top'
		}
	});
	map.setLayoutProperty(title, 'visibility', 'none');
}

//-----------------------------------------------------------------------

function loadGeoJSONPolygon(title, url) {
	'use strict';

	map.addSource(title, {
		type: 'geojson',
		data: url
	});

	map.addLayer({
		id: title,
		type: 'fill',
		source: title,
		visibility: 'none',
		layout: {},
		paint: {
			'fill-color': '#088',
			'fill-opacity': 0.8
		}
	});
	map.setLayoutProperty(title, 'visibility', 'none');
}

//-----------------------------------------------------------------------

map.on('load', function () {
	'use strict';

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

	loadGeoJSON('schools', 'http://moerser.tursics.de/?site=https://www.moers.de/www/verzeichnis-04.nsf/apijson.xsp/view-list-category1');
	loadGeoJSONPolygon('VERWALT_EINH', baseURI + '/map/ALKIS_ADV_SHAPE_Krefeld_VERWALT_EINH.json');
	buildMenu();

	// next step:
	// https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
});
