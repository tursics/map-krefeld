/*jslint browser: true*/
/*global require,console*/

//-----------------------------------------------------------------------

function start() {
	'use strict';

	var uri = 'https://www.krefeld.de/www/hotel_restaurant.nsf/apijson.xsp/view-list-az',
		libFile = require('./libFile'),
		libGeocode = require('./libGeocode');

	libFile.downloadSpecialFormatData(uri, function (data) {
		var result = [],
			i,
			j,
			item,
			hotel,
			restaurant,
			cat;

		for (i = 0; i < data.length; ++i) {
			item = data[i];
			hotel = false;
			restaurant = false;
			cat = item.object.Kategorie1;

			if ('string' === typeof cat) {
				cat = [cat];
			}
			for (j = 0; j < cat.length; ++j) {
				if (-1 !== ['Hotel', 'Hotel_Rest', 'Gästehaus', 'Ferienzimmer', 'Gruppenunterkunft'].indexOf(cat[j])) {
					hotel = true;
				} else if (-1 !== ['Gastronomie'].indexOf(cat[j])) {
					restaurant = true;
				}
			}

			result.push({
				title: item.object.Bezeichnung,
				description: item.object.Content_2,
				short: item.object.Kurzbemerkung,
				cat1: item.object.Kategorie1,
				cat2: item.object.Kategorie2,
				cat3: item.object.Kategorie3,
				hotel: hotel,
				restaurant: restaurant,
				street: item.object.SStrasse,
				zip: item.object.SPLZ,
				city: item.object.SOrt,
				region: item.object.SOrtsteil,
				tel: item.object.TelefonBuero,
				mail: item.object.MailInternet,
				features: item.object.Ausstattung,
				beds: item.object.Betten,
				lat: '',
				lng: ''
			});
		}

		libGeocode.geocode(result, function (geoJSON) {
			libFile.saveGeoJSON(geoJSON, 'hotels.json', function (filePath) {
				console.log(filePath);
			});
		});
	});
}

//-----------------------------------------------------------------------

require('./libGeocode').init(start);

//-----------------------------------------------------------------------
//eof
