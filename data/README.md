# Input data

Place the following files in this directory:

| Filename | Description | Produced or obtained from |
|---|---|---|
| `Clasificacion_CDMX_recortada.tif` | Classified land-cover raster | Google Earth Engine script 01 |
| `areas_verdes.gpkg` | Urban green areas | Institutional or project source |
| `suelo_de_conservacion.gpkg` | Conservation land | Institutional or project source |
| `edificios_cdmx.gpkg` | Building footprints | Convert the SHP exported by Earth Engine script 02 to GeoPackage, or change the notebook path |

All vector files must have a correctly defined source CRS. The analysis notebook reprojects them to EPSG:32614. Do not assign EPSG:32614 to layers whose original CRS is unknown.
