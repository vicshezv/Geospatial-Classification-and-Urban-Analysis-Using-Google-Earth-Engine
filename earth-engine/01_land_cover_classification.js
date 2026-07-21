// Land-cover classification of Mexico City using Sentinel-2 imagery.
// Required imported objects: CDMX, urban, vegetation, water, and soil.
// Each training geometry must contain an integer property named "landcover":
// 0 = urban, 1 = vegetation, 2 = water, 3 = bare soil.

var START_DATE = '2026-01-01';
var END_DATE = '2026-04-24';
var MAX_CLOUD_PERCENTAGE = 30;
var RANDOM_SEED = 42;
var TRAINING_FRACTION = 0.70;
var BANDS = ['B2', 'B3', 'B4', 'B8'];
var CLASS_PROPERTY = 'landcover';

var sentinelCollection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate(START_DATE, END_DATE)
  .filterBounds(CDMX)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', MAX_CLOUD_PERCENTAGE));

print('Filtered Sentinel-2 collection:', sentinelCollection);
print('Number of scenes:', sentinelCollection.size());

var composite = sentinelCollection.median().clip(CDMX);
var compositeRGB = composite.visualize({
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1.2
});

Map.addLayer(CDMX, {color: 'black'}, 'Mexico City boundary', false);
Map.addLayer(compositeRGB, {}, 'Sentinel-2 RGB composite', false);
Map.centerObject(CDMX, 12);

var trainingPolygons = urban.merge(vegetation).merge(water).merge(soil);

var samples = composite.select(BANDS).sampleRegions({
  collection: trainingPolygons,
  properties: [CLASS_PROPERTY],
  scale: 10,
  geometries: true
});

var samplesWithRandom = samples.randomColumn('random', RANDOM_SEED);
var trainingPartition = samplesWithRandom.filter(
  ee.Filter.lt('random', TRAINING_FRACTION)
);
var testingPartition = samplesWithRandom.filter(
  ee.Filter.gte('random', TRAINING_FRACTION)
);

var classifier = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  seed: RANDOM_SEED
}).train({
  features: trainingPartition,
  classProperty: CLASS_PROPERTY,
  inputProperties: BANDS
});

print('Random Forest model:', classifier.explain());

var classified = composite.select(BANDS).classify(classifier);
Map.addLayer(
  classified,
  {min: 0, max: 3, palette: ['black', 'green', 'blue', 'brown']},
  'Land-cover classification',
  false
);

var validation = testingPartition.classify(classifier);
var confusionMatrix = validation.errorMatrix(CLASS_PROPERTY, 'classification');
print('Confusion matrix:', confusionMatrix);
print('Overall accuracy:', confusionMatrix.accuracy());
print('Kappa coefficient:', confusionMatrix.kappa());
print('Producer accuracy:', confusionMatrix.producersAccuracy());
print('User accuracy:', confusionMatrix.consumersAccuracy());

Export.image.toDrive({
  image: classified.toByte(),
  description: 'Land_cover_classification_CDMX_2026',
  folder: 'GEE_exports',
  fileNamePrefix: 'Land_cover_classification_CDMX_2026',
  region: CDMX.geometry(),
  scale: 10,
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});

Export.image.toDrive({
  image: compositeRGB,
  description: 'Sentinel2_RGB_CDMX_2026',
  folder: 'GEE_exports',
  fileNamePrefix: 'Sentinel2_RGB_CDMX_2026',
  region: CDMX.geometry(),
  scale: 10,
  maxPixels: 1e13,
  crs: 'EPSG:4326'
});
