# SEO files for VESC Config Saver

This branch holds the search and social files, kept out of `main`. The "Publish site" workflow on `main` combines them with the app when it deploys to GitHub Pages.

| File | Used for |
|---|---|
| `head-index.html` | Search, social preview and structured-data tags, inserted at `<!-- seo:head -->` in `index.html` |
| `head-viewer.html` | The same for `viewer.html` |
| `head-logger.html` | The same for `logger.html` |
| `about-index.html` | The About and FAQ section, inserted at `<!-- seo:about -->` in `index.html` |
| `og.png` | Social preview image (Discord, WhatsApp, X and others) |
| `llms.txt` | Plain-text summary for AI assistants |
| `sitemap.xml` | Sitemap for search engines |

Any other file added here is copied to the site root as-is. Pushing to this branch republishes the site: `.github/workflows/republish.yml` starts the publish workflow on `main`.
