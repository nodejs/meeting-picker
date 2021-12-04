# meeting-picker

## Usage

Put availability data in `data.tsv` and run: `node meeting-picker.js`

You can also pass an argument for how many meeting slots you want selected:
`node meeting-picker.js 4`

TODO: Explain this better (like how to create and format data.tsv, and what the
output looks like and means.)

### With a Google Spreadsheet URL

This currently doesn't work correctly as it picks former TSC members rather than
current TSC members and it also only works with one of the sheets rather than
both sheets (Wednesday and Thursday). But you can still try it, especially if
you want to fix it.

```console
$ GOOGLE_DOC_URL=https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/export?format=tsv node meeting-picker.js
```
