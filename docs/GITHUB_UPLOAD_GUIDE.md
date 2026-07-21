# GitHub publication guide

1. Create a public repository named `cdmx-green-cover-built-environment-analysis`.
2. Do not initialize it with extra files if uploading this complete folder.
3. Open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial release of geospatial analysis workflow"
git branch -M main
git remote add origin https://github.com/[USERNAME]/cdmx-green-cover-built-environment-analysis.git
git push -u origin main
```

4. Replace all bracketed placeholders in `README.md` and `CITATION.cff`.
5. Add the two Earth Engine public links to the README.
6. Create a release tagged `v1.0.0`.
7. Connect the repository to Zenodo and archive the release.
8. Cite the Zenodo DOI in the article and optionally include the GitHub repository URL.
