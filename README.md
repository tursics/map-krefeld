# map-krefeld

**This is the very beginning of the project.**

The goal of this project should be an online map of the city of Krefeld.
All public and open available datasets should be displayed.
As of today 21 datasets are available in the [Open Data portal of Krefeld](https://www.offenesdatenportal.de/organization/krefeld).
Most of the datasets are suited to display on a map (e.g. lists of given names not).

=> [Test a live system](https://tursics.github.io/map-krefeld/)

## Prepare yourself

Install ```nodejs``` and the package manager ```npm```. After finishing run the update command:

    npm update

## First steps

One, most important, fundamental, problem: All data have postal addresses and no geo-coded position coordinates.

Use the script in the ```./build/``` folder to prepare yourself...

---

1. Download SHP files from [Liegenschaftskataster Stadt Krefeld](https://www.offenesdatenportal.de/dataset/liegenschaftskataster-stadt-krefeld)
2. Open ZIP file on [mapshaper.org](http://mapshaper.org/)
3. Select the buildings layer "VERWALT_EINH"
4. Export objects as GeoJSON file
5. Save file to ```./build/ALKIS_ADV_SHAPE_Krefeld_VERWALT_EINH.json```
6. Run script ```node reproject.js``` to convert EPSG:25832 (ETRS89 / UTM zone 32N) to WGS 84

---

1. see above
2. see above
3. Select the buildings layer "GEBAEUDEBAUWERK"
4. Export objects as GeoJSON file
5. Save file to ```./build/ALKIS_ADV_SHAPE_Krefeld_GEBAEUDEBAUWERK.json```
6. Run script ```node generateaddressbook.js``` to create a geocode basics table

---

Generate other data files
2. Run script ```node generateschools.js``` to create a schools geojson file

---

## License

Released under the [MIT License (MIT)](LICENSE.md)
