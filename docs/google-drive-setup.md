# Google Drive backup setup

One-off, takes about 10 minutes and costs nothing. It creates a client ID so the app can save its
backup file to Google Drive. The app uses the `drive.file` permission, so it can only see the files
it creates, nothing else in Drive.

Easiest on a computer, signed in to the Google account whose Drive should hold the backups.

## 1. Create a project
1. Go to **https://console.cloud.google.com/**. Accept the terms if asked.
2. Click the **project picker** at the top (it may say "Select a project") → **New project**.
3. Name it `Mileage Logbook` → **Create**. Make sure it's selected in the project picker.

## 2. Turn on the Google Drive API
1. Go to **https://console.cloud.google.com/apis/library/drive.googleapis.com**.
2. Click **Enable**.

## 3. Set up the sign-in screen
1. Go to **https://console.cloud.google.com/auth/overview** and click **Get started**.
2. **App information:** App name `Mileage Logbook`, User support email: your email → **Next**.
3. **Audience:** choose **External** → **Next**.
4. **Contact information:** your email → **Next**. Tick the agreement → **Continue** → **Create**.
5. In the left menu open **Audience**. Under **Test users**, click **Add users**, add your own Gmail
   address, and **Save**. Leave the publishing status as **Testing**.
6. In the left menu open **Data access** → **Add or remove scopes**. Type `drive.file` in the filter,
   tick **…/auth/drive.file** ("See, edit, create and delete only the specific Google Drive files
   you use with this app") → **Update** → **Save**.

## 4. Create the client ID
1. In the left menu open **Clients** → **Create client**.
2. **Application type:** Web application. **Name:** `Mileage app`.
3. Under **Authorised JavaScript origins** click **Add URI** and enter exactly:
   `https://cmeprojects.github.io`
   (no slash at the end). If the app ever moves to another address, add that one too.
4. Under **Authorised redirect URIs** click **Add URI** and enter
   `https://cmeprojects.github.io/MileageTracker/` (with the slash at the end). This is used by
   "Sign in another way" when the sign-in window is blocked. Then **Create**.
5. Copy the **Client ID**. It ends in `.apps.googleusercontent.com`.

## 5. Put it in the app
- Open the app → **Reports** → **Backup & restore** → **Google Drive** → paste the client ID →
  **Save client ID** → **Back up to Drive now**.
- Sign in to Google. Because the app is in "Testing", Google shows **"Google hasn't verified this
  app"**. That's normal for a private app: tap **Continue**, then allow access.
- On iPhone, if the sign-in window doesn't open, use **Sign in another way**.

The client ID isn't a secret. It can be put in `public/js/config.js` so it doesn't need pasting
on each device.

## How backups work afterwards
- After 10pm (or the next time the app is opened) it backs up to Drive automatically if signed in
  within the last hour. Otherwise the reminder shows **Back up to Google Drive**, one tap.
- The file is `My Drive / Mileage Logbook backups / mileage-backup.zip`. Each backup replaces the
  previous one, and Google Drive keeps older versions for about 30 days (right-click → Manage versions).
- On a new phone: **Restore from Drive**.
