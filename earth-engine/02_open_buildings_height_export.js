// Building-footprint and elevation extraction for Mexico City.
// Required imported object: CDMX.

var roi = CDMX.geometry();
var BUILDING_CONFIDENCE = 0.70;
var HEIGHT_YEAR = 2023;

Map.centerObject(roi, 12);
Map.addLayer(roi, {color: 'yellow'}, 'Study area', true);

var buildings = ee.FeatureCollection('GOOGLE/Research/open-buildings/v3/polygons')
  .filterBounds(roi)
  .filter(ee.Filter.gte('confidence', BUILDING_CONFIDENCE));

print('Buildings in study area:', buildings.size());

Map.addLayer(
  buildings.style({color: '00FFFF', fillColor: '00000022', width: 1}),
  {},
  'Open Buildings footprints',
  false
);

// HEIGHT_YEAR identifies the annual image in the temporal collection; it is
// not the construction year of individual buildings.
var temporalBuildings = ee.ImageCollection(
    'GOOGLE/Research/open-buildings-temporal/v1'
  )
  .filterDate(
    ee.Date.fromYMD(HEIGHT_YEAR, 1, 1),
    ee.Date.fromYMD(HEIGHT_YEAR + 1, 1, 1)
  )
  .filterBounds(roi);

print('Temporal images found:', temporalBuildings.size());

var heightImage = temporalBuildings.mosaic().select('building_height');
Map.addLayer(
  heightImage.clip(roi),
  {
    min: 0,
    max: 40,
    palette: [
      '0b3d91', '1d91c0', '41b6c4', '7fcdbb', 'c7e9b4',
      'ffffcc', 'fdae61', 'f46d43', 'd73027'
    ]
  },
  'Building-height raster',
  false
);

var buildingsWithHeight = heightImage.reduceRegions({
  collection: buildings,
  reducer: ee.Reducer.mean(),
  scale: 4,
  tileScale: 16,
  maxPixelsPerRegion: 1e7
}).map(function(feature) {
  return ee.Feature(feature.geometry(), {
    confidence: feature.get('confidence'),
    height_m: feature.get('mean')
  });
});

var dem = ee.Image('USGS/SRTMGL1_003').select('elevation');
Map.addLayer(dem.clip(roi), {min: 2200, max: 2600}, 'SRTM DEM', false);

var buildingsWithElevation = buildingsWithHeight.map(function(feature) {
  var centroid = feature.geometry().centroid(1);
  var elevationDictionary = dem.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: centroid,
    scale: 30,
    bestEffort: true,
    maxPixels: 1e6,
    tileScale: 4
  });

  var baseElevation = elevationDictionary.get('elevation');
  var height = feature.get('height_m');
  var roofElevation = ee.Algorithms.If(
    ee.Algorithms.IsEqual(baseElevation, null),
    null,
    ee.Algorithms.If(
      ee.Algorithms.IsEqual(height, null),
      null,
      ee.Number(baseElevation).add(ee.Number(height))
    )
  );

  return ee.Feature(feature.geometry(), {
    confidence: feature.get('confidence'),
    height_m: height,
    base_elev_m: baseElevation,
    roof_elev_m: roofElevation
  });
});

var buildingsExport = buildingsWithElevation.filter(
  ee.Filter.notNull(['height_m', 'base_elev_m', 'roof_elev_m'])
);

print('Exportable buildings:', buildingsExport.size());
print('Sample:', buildingsExport.limit(5));

Map.addLayer(
  buildingsExport.style({color: 'FFFFFF', fillColor: '00FF0033', width: 1}),
  {},
  'Buildings with elevation attributes',
  false
);

Export.table.toDrive({
  collection: buildingsExport,
  description: 'Open_Buildings_CDMX_with_elevation',
  folder: 'GEE_exports',
  fileNamePrefix: 'Open_Buildings_CDMX_with_elevation',
  fileFormat: 'SHP',
  selectors: ['confidence', 'height_m', 'base_elev_m', 'roof_elev_m'],
  maxVertices: 5000
});
