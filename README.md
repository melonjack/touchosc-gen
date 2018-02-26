Official editor is great, but when it comes to hundreds of controls a little hack might be sufficient. Here's the script which converts .touchosc presets to .zip archives and derives its XML data.

Also it's supposed to work only for my specific layouts, so don't expect too much from it, but just inspiration to make it better yourself.

## process

1. Open dest/index.xml.zip.touchosc in Touch OSC editor
2. Edit preset, Save & Exit
3. Run `node load.js` to copy preset from dest to src/index.xml
4. Run `node assign.js` to make new dest/index.xml.zip.touchosc preset
5. Open dest/index.xml.zip.touchosc and Sync with iPad
