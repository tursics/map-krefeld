# map-krefeld

**This is the very beginning of the project.**

The goal of this project should be an online map of the city of Krefeld.
All public and open available datasets should be displayed.
As of today 21 datasets are available in the [Open Data portal of Krefeld](https://www.offenesdatenportal.de/organization/krefeld).
Most of the datasets are suited to display on a map (e.g. lists of given names not).

=> [Test a live system](https://tursics.github.io/map-krefeld/)

## First steps

One, most important, fundamental, problem: All data have postal addresses and no geo-coded position coordinates.

Use the script in the ```./build/``` folder to prepare yourself...

1. Download SHP files from [Liegenschaftskataster Stadt Krefeld](https://www.offenesdatenportal.de/dataset/liegenschaftskataster-stadt-krefeld)
2. Open ZIP file on [mapshaper.org](http://mapshaper.org/)
3. Select the buildings layer "GEBAEUDEBAUWERK"
4. Export objects as GeoJSON file

## License

Released under the [MIT License (MIT)](LICENSE.md)
