/*jslint browser: true*/
/*global require,console*/

//-----------------------------------------------------------------------

function start() {
	'use strict';

	var uri = 'https://www.krefeld.de/www/kinderbetreuung.nsf/apijson.xsp/view-list-az',
		libFile = require('./libFile'),
		libGeocode = require('./libGeocode');

	libFile.downloadSpecialFormatData(uri, function (data) {
		var result = [],
			i,
			item,
			description;

		for (i = 0; i < data.length; ++i) {
			item = data[i];
			description = item.object.Beschreibung;
			if ('object' === typeof description) {
				description = '';
			}

			result.push({
				title: item.object.Bezeichnung,
				description: description,
				cat1: item.object.Kategorie1,
				cat2: item.object.Kategorie2,
				cat3: item.object.Kategorie3,
				street: item.object.SStrasse,
				zip: item.object.SPLZ,
				city: item.object.SOrt,
				region: item.object.SOrtsteil,
				state: item.object.SLand,
				tel: item.object.TelefonBuero,
				mail: item.object.MailInternet,
				web: item.object.Homepage,
				text1: item.object.SonstigesText1 || '',
				text2: item.object.SonstigesText2 || '',
				text3: item.object.SonstigesText3 || '',
				text4: item.object.SonstigesText4 || '',
				text5: item.object.SonstigesText5 || '',
				text6: item.object.SonstigesText6 || '',
				text7: item.object.SonstigesText7 || '',
				text8: item.object.SonstigesText8 || '',
				text9: item.object.SonstigesText9 || '',
				lat: item.preview.SLat,
				lng: item.preview.SLng
			});
		}

		libGeocode.geocode(result, function (geoJSON) {
			libFile.saveGeoJSON(geoJSON, 'kindergartens.json', function (filePath) {
				console.log(filePath);
			});
		});
	});
}

//-----------------------------------------------------------------------

require('./libGeocode').init(start);

//-----------------------------------------------------------------------
//eof
