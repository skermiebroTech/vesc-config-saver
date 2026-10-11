# VESC Config Saver

A web page that connects to a VESC controller over Bluetooth, reads its full configuration and opens it in a config viewer, where it can be downloaded as one JSON file:

- motor config
- app config
- every package config on every VESC device on the board's CAN bus: Refloat, Float, TNT (Trick and Trail), Balance and any other package that registers a config page, plus the VESC Express's own settings

Passwords and PINs (such as a VESC Express's Wi-Fi password and Bluetooth PIN) are never saved. Their values are replaced with "(hidden)", and raw data isn't kept for any config page that contains them.

For each part the file holds the raw config data (the same bytes VESC Tool reads, base64-encoded) plus the decoded setting names and values. Package configs also include their own definition, so they can always be decoded later.

The page only reads from the controller. It never changes settings.

## Ride logger

`logger.html` records ride data in two ways and shows it on synced charts with an event list (disengages and their reason, pushbacks, wheel slip, alerts), with CSV export:

- **Live log** over Bluetooth, about 10–30 samples a second, logging everything the board offers. With Refloat: every Refloat realtime field on every sample (speed, duty, currents, voltage, temperatures, pitch, roll, every setpoint, foot sensors, remote input, distance, energy, charging, GPS if fitted, and the package state, pushback type, stop reason and alerts). VESC's own values (fault codes, FOC currents and voltages, each MOSFET temperature, tachometer) on every 5th sample, the raw IMU (accelerometer, gyro, orientation) on every 10th, and VESC BMS cell voltages on every 20th if a VESC BMS is present. Without Refloat, the VESC values and IMU on every sample. Motor controller faults show up as events. The screen has to stay on, so the page keeps it awake.
- **Refloat's on-board data recording**: a few seconds at the full balance-loop rate, recorded inside the controller. Needs firmware with the recording buffer (Refloat Extras). Downloading it pauses the recording, as Refloat's own screen does; it restarts on the next engage.

Live logs are saved in the browser every few seconds, so a log can be recovered if the page closes.

## Config viewer

`viewer.html` shows a card for every setting: its value, a plain-language note on what it means, a practical tip, and whether it has been changed from the default. Settings are grouped the same way as in VESC Tool, with search and a filter for changed settings. Sections a balance board doesn't use (BLDC, DC, PPM, PAS and so on) are hidden unless you ask for them.

On wide screens it switches to a desktop layout with a section list in a sidebar and cards in columns. The Auto / Phone / Desktop buttons override this.

The plain-language notes are in `guide.js`. Official descriptions, defaults and the data layout for each firmware version come from VESC Tool's parameter files (`desc/`) and, for Refloat, from the definition saved inside each export.

## Use

Open the GitHub Pages site in Chrome on Android (Web Bluetooth needs Chrome and https).

1. Turn the board on and close VESC Tool. Only one app can hold the Bluetooth connection.
2. Tap **Connect and read config** and pick the controller. Boards that use a VESC Express for Bluetooth are handled automatically.
3. The config viewer opens with your settings. Tap **Download config** to save the JSON file.

Readable motor and app values work for every VESC firmware release from 3.55 to 7.01, including the built-in Balance app in older firmware (3.62 to 6.02). The definitions in `desc/` are generated from VESC Tool's parameter files. On any other version the raw data is still saved, and Refloat or Float package settings are always readable because the controller sends their definition.

## Hosting

Settings → Pages → Deploy from a branch → `main`, folder `/ (root)`.

## Publishing

The site is published by the "Publish site" workflow (`.github/workflows/pages.yml`), not straight from a branch. It takes the app from `main` and adds the search and social files from the `seo` branch (tags, structured data, the About section, the preview image, `llms.txt` and the sitemap) at the `<!-- seo:head -->` and `<!-- seo:about -->` markers. Pushing to either branch republishes the site.

This needs **Settings → Pages → Build and deployment → Source** set to **GitHub Actions**. If it's set to deploy from a branch, GitHub's own publisher also runs on every push and can overwrite the site with `main` alone, without the SEO files.
