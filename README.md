# Green Cover and Built Environment Analysis in Mexico City

This repository contains the reproducible geospatial workflows used to analyze urban green areas, conservation land, land-cover classes, and building footprints in Mexico City. It accompanies the scientific article Geospatial Classification and Urban Analysis Using Google Earth Engine.

## Repository contents

- `notebooks/01_raster_to_vector_conversion.ipynb`: converts the classified raster into vector polygons.
- `notebooks/02_green_cover_spatial_analysis.ipynb`: calculates spatial differences and area statistics for green cover, conservation land, class 0, and building footprints.
- `earth-engine/01_land_cover_classification.js`: performs supervised Sentinel-2 land-cover classification and accuracy assessment.
- `earth-engine/02_open_buildings_height_export.js`: extracts Open Buildings footprints and assigns building height, terrain elevation, and roof elevation.
- `original-notebooks/`: preserves the two notebooks supplied before repository standardization.

## Study area

The study area is Mexico City, Mexico. Area calculations are performed in **WGS 84 / UTM zone 14N (EPSG:32614)**.

## Software

- Python 3.11 or 3.12
- Visual Studio Code with the Jupyter extension, or JupyterLab
- Google Earth Engine Code Editor

## Python installation

Using `pip`:

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Using Conda:

```bash
conda env create -f environment.yml
conda activate cdmx-green-cover
```

## Required input data

Place the required files in `data/` using the filenames documented in [`data/README.md`](data/README.md). Large or restricted datasets are intentionally excluded from version control.

The Earth Engine scripts require these imported objects:

- `CDMX`: Mexico City boundary.
- `urban`, `vegetation`, `water`, and `soil`: manually delineated training polygons with an integer `landcover` field.

Class labels in the classification script are:

| Value | Class |
|---:|---|
| 0 | Urban |
| 1 | Vegetation |
| 2 | Water |
| 3 | Bare soil |

## Reproduction sequence

1. Prepare or download the required datasets.
2. Run `earth-engine/01_land_cover_classification.js` and export the classification raster.
3. Run `earth-engine/02_open_buildings_height_export.js` and export the building footprints.
4. Place and rename the exported files according to `data/README.md`.
5. Run `notebooks/01_raster_to_vector_conversion.ipynb`.
6. Run `notebooks/02_green_cover_spatial_analysis.ipynb`.

## Outputs

Generated outputs are written to `outputs/` and are not tracked by Git. Expected products include:

- vectorized land-cover classification;
- combined urban-green-area and conservation-land baseline;
- remaining area after removal of class 0;
- final remaining area after removal of building footprints;
- summary statistics in hectares and percentages.

## Earth Engine links

After saving each script in the Earth Engine Code Editor, use **Get Link** and replace the placeholders below:

- Land-cover classification: `https://code.earthengine.google.com/ac7e4554ac6be94825c257e3f9d54f47`
- Open Buildings extraction: `https://code.earthengine.google.com/2f870a16c25b2a3ed93ed611bad1b061`

## Data and licensing

The MIT License applies only to the original source code in this repository. Third-party data remain governed by their respective terms and licenses. Users are responsible for citing Sentinel-2, SRTM, Google Research Open Buildings, and the institutional sources of local geospatial layers.

## Citation

Use the citation metadata in [`CITATION.cff`](CITATION.cff). For the published article, create a GitHub release and archive that release in Zenodo to obtain a version-specific DOI.

## Author

Víctor M. Sánchez Vega  
ORCID: `https://orcid.org/0009-0007-6830-0711`
