/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	addressBook: {},

	//-------------------------------------------------------------------
	// http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers

	isNumeric: function (n) {
		'use strict';

		return !isNaN(parseFloat(n)) && isFinite(n);
	},

	//-------------------------------------------------------------------

	init: function (callback) {
		'use strict';

		var fs = require('fs'),
			filepath = '../map/addressbook.csv',
			that = this;

		if (fs.existsSync(filepath)) {
			fs.readFile(filepath, 'utf-8', function (err, str) {
				if (err) {
					console.error(err);
				} else {
					var csv = {},
						lines,
						line,
						i;

					lines = str.split("\n");
					for (i = 1; i < lines.length; ++i) {
						line = lines[i].split(';');
						csv[line[0]] = {lat: parseFloat(line[2]), lng: parseFloat(line[3])};
					}

					that.addressBook = csv;
					callback();
				}
			});
		} else {
			console.error('Error! No addressbook.csv found.');
		}
	},

	//-------------------------------------------------------------------

	street2geo: function (theStreet, theCity) {
		'use strict';

		var street = theStreet.toLowerCase(),
			number = '',
			tmp,
			ret;

		// Glockenspitz 348/350
		street = street.split('/')[0];
		// Lindenstr. 52
		street = street.replace('str.', 'straße');
		// Tulpenstrasse 11
		street = street.replace('strasse', 'straße');
		// Krefelder Staße 81
		street = street.replace('staße', 'straße');
		// Sankt-Töniser-Straße 173
		street = street.replace('sankt', 'st.');
		// Theaerplatz 1
		street = street.replace('theaerplatz', 'theaterplatz');
		// Am Rennstieg 1
		street = street.replace('am rennstieg', 'rennstieg');
		// Kaiserstr.61
		street = street.replace(new RegExp(' ', 'g'), '');
		// Schmiedestraße 90-98
		if ((street.lastIndexOf('-') > -1) && (this.isNumeric(street.substr(street.lastIndexOf('-') + 1, 1)))) {
			street = street.substr(0, street.lastIndexOf('-'));
		}
		// Von-Ketteler- Straße 31
		street = street.replace(new RegExp('-', 'g'), '');
		street = street.replace(new RegExp('\\.', 'g'), '');
		street = street.replace(/\r?\n|\r/g, '');

		ret = this.addressBook[street];
		if (typeof ret !== 'undefined') {
			return ret;
		}

		// Herrenweg 10/14
		if (theStreet.split('/').length > 1) {
			while (this.isNumeric(street.substr(-1))) {
				street = street.substr(0, street.length - 1);
			}
			street += theStreet.split('/')[1].trim();

			ret = this.addressBook[street];
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}

		// Bahnhofstraße 73 => Bahnhofstraße 74
		if (true) {
			tmp = street;
			while (this.isNumeric(street.substr(-1))) {
				number = street.substr(street.length - 1, 1) + number;
				street = street.substr(0, street.length - 1);
			}
			street += parseInt(number, 10) + 1;

			ret = this.addressBook[street];
			if (typeof ret !== 'undefined') {
				return ret;
			}
			street = tmp;
		}

		// Petersstraße => Petersstraße 1
		if (true) {
			tmp = street;
			while (this.isNumeric(street.substr(-1))) {
				street = street.substr(0, street.length - 1);
			}
			street += "1";

			ret = this.addressBook[street];
			if (typeof ret !== 'undefined') {
				return ret;
			}
			street = tmp;
		}

		console.log('Could not geocode: ' + theStreet + ', ' + theCity);
		return {lat: 0, lng: 0};
	},

	//-------------------------------------------------------------------

	geocode: function (data, callback) {
		'use strict';

		var turf = require('@turf/turf'),
			i,
			point,
			features = [];

		for (i = 0; i < data.length; ++i) {
			point = this.street2geo(data[i].street || '', data[i].city || '');
			data[i].lat = point.lat;
			data[i].lng = point.lng;

			features.push(
				turf.feature({
					type: 'Point',
					coordinates: [data[i].lng, data[i].lat]
				},
					data[i]
					)
			);
		}

		callback(turf.featureCollection(features));
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
