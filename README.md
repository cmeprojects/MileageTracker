# Mileage Tracker

A mileage logbook and car expense tracker for my phone. I use it to log business and personal
trips, keep receipts, and produce the records I need at tax time (ATO logbook, ABN/TFN split).

App: https://cmeprojects.github.io/MileageTracker/

It's a plain web app with no server and no account. All data stays on the device. Add it to the
home screen and it works like a normal app, including offline.

- iPhone (Safari or Chrome): Share > Add to Home Screen. Use that icon from then on. iPhone keeps
  each home-screen app's data separate from the browser.
- Android (Chrome): menu > Install app.

## What it does

### Trips
- One tap to start a trip: Business ABN, Business TFN, To work, To home or Personal. Time and start
  odometer are filled in automatically.
- Finish by entering the end odometer or the distance. For routes I've driven before it offers the
  usual distance.
- Business trips record the client. Driving straight from one client to the next is marked as
  "between clients", with ABN/TFN shown at both ends.
- Warns if a trip has been left running for 3+ hours, and asks for an odometer check once a week
  so missed km get picked up.
- Breakdown by week, month, quarter or financial year: business vs personal %, and ABN vs TFN.

### Expenses
- Amount, category, supplier, odometer and a receipt photo (compressed to a few hundred KB).
- Petrol has a list of Australian fuel brands, plus litres and a full-tank switch for fuel
  economy (L/100 km), price per litre and cost per km. It flags fuel use that is higher than
  usual, or a fill-up that looks missed.
- Categories: petrol, service, repairs, parts, tyres, car wash, rego, insurance, tolls & parking,
  clothing, laundry, and custom ones.
- Car-related costs are split by mileage into Personal / ABN / TFN. Other costs are listed but not
  split.

### Reminders
- Service due by km or months (default 10,000 km / 12 months), worked out from the last service.
- Rego and insurance renewals. Paying one rolls the reminder on a year.

### Reports (Excel and CSV)
- Weekly, monthly, quarterly and financial-year reports, created automatically after each period.
- Expense report for any date range: totals by category, every expense, the Personal/ABN/TFN
  split of car costs, and fuel figures.
- ATO 12-week logbook, with progress on the home screen and reminders to finalise it, renew it
  after 5 years, or redo it if business use changes a lot.
- Logbook vs cents-per-km comparison for a financial year.
- Tax pack: one zip per financial year with the workbook, logbook, summary and receipt photos.
- Rename or merge client names.

### Backup
- A copy is kept inside the app every night, and there's a reminder to save `mileage-backup.zip`
  (trips, expenses and photos) somewhere safe.
- Optional Google Drive backup: see [docs/google-drive-setup.md](docs/google-drive-setup.md). It
  uploads to "Mileage Logbook backups" in Drive and only has access to its own file.

Data only lives on the device, so deleting the app or clearing browser data deletes it too. Keep
backups.

## Shortcuts (Android)
Long-press the app icon for Start ABN trip, Start TFN trip, Add expense, To home and To work.

## Publishing
GitHub Actions runs the tests and publishes `public/` to GitHub Pages on every push
(Settings > Pages > Source: GitHub Actions). Phones pick up the new version after the app is
reopened.

## Development

```bash
npm install
npm start      # http://localhost:8080
npm test
```

Plain HTML, CSS and JavaScript in `public/`, no build step. The logic in `public/js/` is shared
with the Node tests in `test/`. ExcelJS and JSZip are bundled in `public/vendor/` so it works
offline.
