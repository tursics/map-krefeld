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
//						console.error(x);
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

function start() {
	'use strict';

	var reproject = require('reproject'),
		epsg = require('epsg'),
		proj4 = require('proj4');

	// http://spatialreference.org/ref/epsg/25832/proj4js/
	proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs');

	getJSON('ALKIS_ADV_SHAPE_Krefeld_VERWALT_EINH.json', function (json) {
		var geoJSON = reproject.toWgs84(json, proj4.defs('EPSG:25832'), epsg);
		saveGeoJSON(geoJSON, 'ALKIS_ADV_SHAPE_Krefeld_VERWALT_EINH.json', function (filePath) {
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
