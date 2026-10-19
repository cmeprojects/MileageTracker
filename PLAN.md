# Design notes

## Why a web app with no server
- It needs to work on my phone in the car, often with poor signal, so data is stored on the
  device (IndexedDB) and the app files are cached by a service worker.
- No server means nothing to pay for or maintain. GitHub Pages hosts the static files.
- The catch: a web page can't run in the background. Reports and backups are done at midnight /
  10pm if the app is open, otherwise the next time it's opened, and anything missed is caught up.

## Data
- trips: start/end time, start/end odometer, distance, category (personal/business), type
  (personal travel, home, work, ABN, TFN), client, between-clients from/to, notes.
- expenses: date, amount, category, supplier, odometer, litres, full tank, receipt photo id.
- photos: compressed JPEGs, stored separately from expenses.
- reports: snapshot of the rows and totals at the time the report was made.
- meta: settings (car details, reminders, logbook in progress, Google client ID, backup times).

## Tax rules it follows
- ATO logbook: 12 continuous weeks, valid for 5 years. Business-use % = business km / total km by
  odometer (unlogged km count as private).
- Car-related costs are split by business-use %, then ABN/TFN by business km.
- Cents per km: business km capped at 5,000 per car, at the rate for the year (entered manually).
- Tolls and parking are shown separately because they're claimed on top under either method.

These are estimates to take to an accountant, not tax advice.

## Ideas for later
- Multiple vehicles.
- GPS distance tracking while the app is open.
- Reading receipts automatically.
- Mirror the data to a Google Sheet.
