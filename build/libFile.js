/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------
	// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery

	hashCode: function (str) {
		'use strict';

		var hash = 0, i, chr;
		if (str.length === 0) {
			return hash;
		}

		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	},

	//-------------------------------------------------------------------

	downloadFile: function (filepath, uri, callback) {
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
	},

	//-------------------------------------------------------------------

	downloadURI: function (uri, callback) {
		'use strict';

		var filePath,
			fs = require('fs');

		filePath = '../temp';
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}
		filePath += '/' + this.hashCode(uri);

		this.downloadFile(filePath, uri, function () {
			callback(filePath);
		});
	},

	//-------------------------------------------------------------------

	getJSON: function (filepath, callback) {
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
	},

	//-------------------------------------------------------------------

	downloadSpecialFormatData: function (uri, callback) {
		'use strict';

		var arr = [],
			idx = 0,
			result = [],
			that = this;

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

				that.downloadURI(uri2, function (filePath2) {
					that.getJSON(filePath2, function (objJSON) {
						result.push({preview: item, object: objJSON});

						++idx;
						processOne();
					});
				});
			} else {
				callback(result);
			}
		}

		this.downloadURI(uri, function (filePath) {
			that.getJSON(filePath, function (json) {
				arr = json || [];
				idx = 0;

				processOne();
			});
		});
	},

	//-------------------------------------------------------------------

	saveGeoJSON: function (geoJSON, filename, callback) {
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

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
