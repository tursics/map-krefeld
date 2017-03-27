/*jslint browser: true*/
/*global require,console*/

//-----------------------------------------------------------------------

function start() {
	'use strict';

	var uri = 'https://www.krefeld.de/www/schulen.nsf/apijson.xsp/view-list-az',
		libFile = require('./libFile'),
		libGeocode = require('./libGeocode');

	libFile.downloadSpecialFormatData(uri, function (data) {
		var result = [],
			i,
			item;

		for (i = 0; i < data.length; ++i) {
			item = data[i];
			result.push({
				title: item.object.Bezeichnung,
				description: item.object.Beschreibung,
				cat1: item.object.Kategorie1,
				cat2: item.object.Kategorie2,
				cat3: item.object.Kategorie3,
				street: item.object.SStrasse,
				zip: item.object.SPLZ,
				city: item.object.SOrt,
				region: item.object.SOrtsteil,
				tel: item.object.TelefonBuero,
				tax: item.object.TelefaxBuero,
				mail: item.object.MailInternet,
				web: item.object.Homepage,
				lat: item.preview.SLat,
				lng: item.preview.SLng
			});
		}

		libGeocode.geocode(result, function (geoJSON) {
			libFile.saveGeoJSON(geoJSON, 'schulen.json', function (filePath) {
				console.log(filePath);
			});
		});
	});
}

//-----------------------------------------------------------------------

require('./libGeocode').init(start);

//-----------------------------------------------------------------------
//eof
