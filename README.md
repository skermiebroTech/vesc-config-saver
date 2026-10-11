# VESC Config Saver

A single web page that connects to a VESC controller over Bluetooth and saves its full configuration to one JSON file:

- motor config
- app config
- every package config the firmware reports, such as Refloat, including the full tune

For each part the file holds the raw config data (the same bytes VESC Tool reads, base64-encoded) plus the decoded setting names and values. Package configs also include their own definition, so they can always be decoded later.

The page only reads from the controller. It never changes settings.

## Use

Open the GitHub Pages site in Chrome on Android (Web Bluetooth needs Chrome and https).

1. Turn the board on and close VESC Tool. Only one app can hold the Bluetooth connection.
2. Tap **Connect and save config** and pick the controller.
3. The JSON file is saved to Downloads.

Readable motor and app values are built in for firmware 6.05, 6.06, 7.00 and 7.01. On other versions the raw data is still saved.

## Hosting

Settings → Pages → Deploy from a branch → `main`, folder `/ (root)`.
