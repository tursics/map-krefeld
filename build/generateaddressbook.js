/*jslint browser: true*/
/*global require,console*/

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

function saveCSV(addressBook, filename, callback) {
	'use strict';

	var filePath,
		fs = require('fs'),
		arr,
		str = "id;street;lat;lng\n";

	filePath = '../map';
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}
	filePath += '/' + filename;

	arr = Object.keys(addressBook).map(function (key) {
		var id = key.toLowerCase();
		id = id.replace(new RegExp(' ', 'g'), '');
		id = id.replace(new RegExp('-', 'g'), '');
		id = id.replace(new RegExp('\\.', 'g'), '');
		str += id + ';' + key + ';' + addressBook[key] + "\n";
	});

	fs.writeFile(filePath, str, function (err) {
		if (err) {
			return console.log(err);
		}
		callback(filePath);
	});
}

//-----------------------------------------------------------------------

function sortData(data) {
	'use strict';

	var keys = Object.keys(data),
		i,
		key,
		len = keys.length,
		obj = {};

	keys.sort();

	for (i = 0; i < len; ++i) {
		key = keys[i];
		obj[key] = data[key];
	}

	return obj;
}

//-----------------------------------------------------------------------

function parseBuildings(features) {
	'use strict';

	var turf = require('@turf/turf'),
		reproject = require('reproject'),
		epsg = require('epsg'),
		proj4 = require('proj4'),
		i,
		s,
		n,
		len,
		properties,
		center,
		streets,
		street,
		number,
		address,
		lat,
		lng,
		addressBook = {};

	// http://spatialreference.org/ref/epsg/25832/proj4js/
	proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs');

	len = features.length;
	for (i = 0; i < len; ++i) {
		properties = features[i].properties;
		center = turf.center(features[i]);
		streets = properties.LAGEBEZTXT;

		if ('' !== streets) {
			center = reproject.toWgs84(center, proj4.defs('EPSG:25832'), epsg);
			center = turf.truncate(center, 6);
			lat = center.geometry.coordinates[1];
			lng = center.geometry.coordinates[0];

			street = streets.split(';');
			for (s = 0; s < street.length; ++s) {
				number = street[s].split(',');
				address = number[0].substr(0, number[0].lastIndexOf(' '));
				number[0] = number[0].substr(number[0].lastIndexOf(' '));

				address = address.replace('Str.', 'Straße');
				address = address.replace('Luth.-Kirch', 'Lutherische-Kirch');

				for (n = 0; n < number.length; ++n) {
					addressBook[address.trim() + ' ' + number[n].trim()] = lat + ';' + lng;
				}
			}
		}
	}

	return sortData(addressBook);
}

//-----------------------------------------------------------------------

function start() {
	'use strict';

	getJSON('ALKIS_ADV_SHAPE_Krefeld_GEBAEUDEBAUWERK.json', function (json) {
		var data = parseBuildings(json.features);
		saveCSV(data, 'addressbook.csv', function (filePath) {
			console.log(filePath);
		});
	});
}

//-----------------------------------------------------------------------

try {
	start();
} catch (e) {
	console.error(e);
}

//-----------------------------------------------------------------------
//eof
