/*jslint browser: true*/
/*global require,console*/

//-----------------------------------------------------------------------

var addressBook = {};

//-----------------------------------------------------------------------
// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery

String.prototype.hashCode = function () {
	'use strict';

	var hash = 0, i, chr;
	if (this.length === 0) {
		return hash;
	}

	for (i = 0; i < this.length; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

//-----------------------------------------------------------------------
// http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers

function isNumeric(n) {
	'use strict';

	return !isNaN(parseFloat(n)) && isFinite(n);
}

//-----------------------------------------------------------------------

function downloadFile(filepath, uri, callback) {
	'use strict';

	var fs = require('fs'),
		http = require('http'),
		https = require('https'),
		file = fs.createWriteStream(filepath);

	if (uri.indexOf('https://') === 0) {
		file.on('finish', function () {
			file.close(callback);
		});

		https.get(uri, function (response) {
			response.pipe(file);
		});
	} else if (uri.indexOf('http://') === 0) {
		file.on('finish', function () {
			file.close(callback);
		});

		http.get(uri, function (response) {
			response.pipe(file);
		});
	} else {
		callback();
	}
}

//-----------------------------------------------------------------------

function downloadURI(uri, callback) {
	'use strict';

	var filePath,
		fs = require('fs');

	filePath = '../temp';
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}
	filePath += '/' + uri.hashCode();

	downloadFile(filePath, uri, function () {
		callback(filePath);
	});
}

//-----------------------------------------------------------------------

function getJSON(filepath, callback) {
	'use strict';

	var fs = require('fs');

	if (fs.existsSync(filepath)) {
		fs.readFile(filepath, 'utf-8', function (err, json) {
			if (err) {
				console.error(err);
			} else {
				if (typeof json === 'string') {
					try {
						json = JSON.parse(json);
					} catch (x) {
						json = null;
					}
				}

				callback(json);
			}
		});
	} else {
		callback(null);
	}
}

//-----------------------------------------------------------------------

function loadAddressBook(callback) {
	'use strict';

	var fs = require('fs'),
		filepath = '../map/addressbook.csv';

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

				addressBook = csv;
				callback();
			}
		});
	} else {
		console.error('Error! No addressbook.csv found.');
	}
}

//-----------------------------------------------------------------------

function saveGeoJSON(geoJSON, filename, callback) {
	'use strict';

	var filePath,
		fs = require('fs');

	filePath = '../map';
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}
	filePath += '/' + filename;

	fs.writeFile(filePath, JSON.stringify(geoJSON), function (err) {
		if (err) {
			return console.log(err);
		}
		callback(filePath);
	});
}

//-----------------------------------------------------------------------

function downloadData(uri, callback) {
	'use strict';

	var arr = [],
		idx = 0,
		result = [];

	function processOne() {
		if (idx < arr.length) {
			var item = arr[idx],
				uri2,
				uriParts;

			if (typeof item['@category'] !== 'undefined') {
				++idx;
				processOne();
				return;
			}

			uriParts = uri.split('/');
			uri2 = uriParts[0] + '/' + uriParts[1] + '/' + uriParts[2] + '/' + item.URL;

			downloadURI(uri2, function (filePath2) {
				getJSON(filePath2, function (objJSON) {
					result.push({preview: item, object: objJSON});

					++idx;
					processOne();
				});
			});
		} else {
			callback(result);
		}
	}

	downloadURI(uri, function (filePath) {
		getJSON(filePath, function (json) {
			arr = json || [];
			idx = 0;

			processOne();
		});
	});
}

//-----------------------------------------------------------------------

function street2geo(theStreet) {
	'use strict';

	var street = theStreet.toLowerCase(),
		ret;

	// Glockenspitz 348/350
	street = street.split('/')[0];
	// Lindenstr. 52
	street = street.replace('str.', 'straße');
	// Tulpenstrasse 11
	street = street.replace('strasse', 'straße');
	// Kaiserstr.61
	street = street.replace(new RegExp(' ', 'g'), '');
	// Schmiedestraße 90-98
	if ((street.lastIndexOf('-') > -1) && (isNumeric(street.substr(street.lastIndexOf('-') + 1, 1)))) {
		street = street.substr(0, street.lastIndexOf('-'));
	}
	// Von-Ketteler- Straße 31
	street = street.replace(new RegExp('-', 'g'), '');
	street = street.replace(new RegExp('\\.', 'g'), '');
	street = street.replace(/\r?\n|\r/g, '');

	ret = addressBook[street];
	if (typeof ret !== 'undefined') {
		return ret;
	}

	// Herrenweg 10/14
	if (theStreet.split('/').length > 1) {
		while (isNumeric(street.substr(-1))) {
			street = street.substr(0, street.length - 1);
		}
		street += theStreet.split('/')[1].trim();

		ret = addressBook[street];
		if (typeof ret !== 'undefined') {
			return ret;
		}
	}

	console.log('Could not geocode: ' + theStreet);
	return {lat: 0, lng: 0};
}

//-----------------------------------------------------------------------

function geocode(data, callback) {
	'use strict';

	var turf = require('@turf/turf'),
		i,
		point,
		features = [];

	for (i = 0; i < data.length; ++i) {
		point = street2geo(data[i].street);
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

//-----------------------------------------------------------------------

function start() {
	'use strict';

	var uri = 'https://www.krefeld.de/www/schulen.nsf/apijson.xsp/view-list-az';

	downloadData(uri, function (data) {
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

		geocode(result, function (geoJSON) {
			saveGeoJSON(geoJSON, 'schulen.json', function (filePath) {
				console.log(filePath);
			});
		});
	});
}

//-----------------------------------------------------------------------

try {
	loadAddressBook(start);
} catch (e) {
	console.error(e);
}

//-----------------------------------------------------------------------
//eof
