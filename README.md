# VESC Config Saver

A web page that connects to a VESC controller over Bluetooth, reads its full configuration and opens it in a config viewer, where it can be downloaded as one JSON file:

- motor config
- app config
- every package config the firmware reports, such as Refloat, including the full tune

For each part the file holds the raw config data (the same bytes VESC Tool reads, base64-encoded) plus the decoded setting names and values. Package configs also include their own definition, so they can always be decoded later.

The page only reads from the controller. It never changes settings.

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
