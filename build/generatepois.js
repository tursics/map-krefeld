/*jslint browser: true*/
/*global require,console*/

//-----------------------------------------------------------------------

function start() {
	'use strict';

//	var uri = 'http://geoportal-niederrhein.de/files/opendatagis/Stadt_Krefeld/POI_Gesamt.geojson',
	var uri = '/Users/thomastursics/Downloads/POI_Gesamt.geojson',
		libFile = require('./libFile'),
		libGeocode = require('./libGeocode');

	libFile.downloadGeoJSON(uri, function (data) {
		var result = [],
			categories = [140200, 990200, 161200,
						  60100, 60200, 60300, 69000, 60400, 60500,
						  20100, 20200, 20300, 29000,
						  10100, 10200, 10300, 10400, 10500, 10700, 10800,
						  10600, 19000, 160100, 160200, 161100, 160600,
						  30800, 110100, 161400, 80300,
						  70100, 70200, 50100,
						  90100, 90200, 90300, 90400, 99000,
						  30100,
						  40100, 49000,
						  70300, 79000],
			filenames = ['dogybags', 'mobilesenders', 'playgrounds',
						 'chirches', 'chirches', 'chirches', 'chircheothers', 'capells', 'lastrest',
						 'kindergarten', 'kindergarten', 'kindergarten', 'kindergarten',
						 'schools', 'schools', 'schools', 'schools', 'schools', 'schools', 'schools',
						 'university', 'schoolsothers', 'sportsfield', 'sportshall', 'sportsschwimming', 'sportsice',
						 'youngth', 'hotels', 'parks', 'parking',
						 'firestations', 'policestations', 'hospitals',
						 'museums', 'theaters', 'culture', 'libraries', 'cultureothers',
						 'careservices',
						 'disabledFleets', 'disabledothers',
						 'administration', 'administrationothers'],
			i,
			pos,
			item;

		function save(pos) {
			libGeocode.geocode(result[pos], function (geoJSON) {
				libFile.saveGeoJSON(geoJSON, filenames[pos] + '.json', function (filePath) {
					console.log(filePath);
				});
			});
		}

		for (pos = 0; pos < categories.length; ++pos) {
			result.push([]);
		}

		for (i = 0; i < data.length; ++i) {
			item = data[i];
			pos = categories.indexOf(item.properties.KATEGORIE);

			if (-1 !== pos) {
				result[pos].push({
					title: (item.properties.NAME || '').trim(),
					description: (item.properties.BEMERKUNG || '').trim(),
					street: (item.properties.STRASSE_HAUSNR || '').trim(),
					zip: item.properties.POSTLEITZAHL,
					city: (item.properties.ORT || '').trim(),
					district: (item.properties.KREIS || '').trim(),
					tel: (item.properties.TELEFON || '').trim(),
					fax: (item.properties.FAX || '').trim(),
					mail: (item.properties.E_MAIL || '').trim(),
					web: (item.properties.INTERNET || '').trim(),
					lat: item.geometry.coordinates[1],
					lng: item.geometry.coordinates[0]
				});
			}
		}

		for (pos = 0; pos < result.length; ++pos) {
			save(pos);
		}
	});
}

//-----------------------------------------------------------------------

start();

//-----------------------------------------------------------------------
//eof
