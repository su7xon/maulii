# TWA Build Guide — Mauli Mobile

This app is now PWA/TWA-ready. To publish it as a **Trusted Web Activity (TWA)** Android app on the Play Store, follow these steps.

## What's already done

| File | Purpose |
|------|---------|
| `public/manifest.webmanifest` | Web App Manifest (`standalone` display, `/` scope) |
| `public/sw.js` | Service worker for offline caching |
| `public/icon.svg` + `public/mauli-logo.png` | App icons |
| `public/_redirects` | Netlify rewrite: `/.well-known/assetlinks.json` → `/assetlinks.json` |
| `public/assetlinks.json` | Digital Asset Links template (fill in fingerprint below) |
| `twa-manifest.json` | Bubblewrap TWA config (`com.maulimobile.app`) |
| `dist/` | Production PWA build (verified working) |

---

## Step 1 — Install JDK 17 + Android SDK (one-time)

Bubblewrap needs **JDK 17** and the **Android SDK command-line tools**.

### Windows
1. Install [JDK 17](https://adoptium.net/) (Eclipse Temurin)
2. Install [Android Studio](https://developer.android.com/studio) → open it → **SDK Manager** → install:
   - Android SDK Command-line Tools (latest)
   - Android SDK Build-Tools
   - Android SDK Platform (API 34+)
   - Google APIs Intel x86 Atom System Image (optional, for emulator)
3. Set environment variables:
   - `JAVA_PATH` → `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
   - `ANDROID_HOME` → `C:\Users\<you>\AppData\Local\Android\Sdk`
   - Add `%JAVA_PATH%\bin` and `%ANDROID_HOME%\cmdline-tools\latest\bin` to `PATH`

### Verify
```powershell
java -version
sdkmanager --version
```

---

## Step 2 — Install Bubblewrap CLI

```powershell
npm install -g @bubblewrap/cli
bubblewrap --version
```

---

## Step 3 — Generate the Android project

From the project root:

```powershell
bubblewrap init --manifest=twa-manifest.json --no-interactive
```

This creates an `android/` directory with a Gradle project. Review `android/app/twa-manifest.json` — it should match your `twa-manifest.json`.

---

## Step 4 — Build the APK / AAB

```powershell
cd android
bubblewrap build
```

- `app-release.apk` — unsigned APK (for testing/sideloading)
- `app-release.aab` — Android App Bundle (for Play Store upload)

If you want a **signed APK** directly, bubblewrap will prompt you to create a keystore, or you can sign manually with `apksigner`/`jarsigner`.

---

## Step 5 — Get the signing certificate SHA-256 fingerprint

TWA requires Digital Asset Links to prove you own the website.

From your signing keystore:

```powershell
keytool -list -v -keystore path/to/your.keystore -alias youralias
```

Look for `SHA256` in the output. It looks like:
```
A1:B2:C3:D4:E5:F6:...
```

---

## Step 6 — Update assetlinks.json & redeploy

Edit `public/assetlinks.json`, replace the placeholder:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.maulimobile.app",
      "sha256_cert_fingerprints": [
        "YOUR:SHA256:FINGERPRINT:HERE"
      ]
    }
  }
]
```

Then redeploy to Netlify:

```powershell
npm run build
# Push to GitHub (Netlify auto-deploys) OR drag dist/ to Netlify drop
```

Verify it's live:
```
https://maulimobile.netlify.app/.well-known/assetlinks.json
```
Should return the JSON with your real fingerprint.

---

## Step 7 — (Optional) Rebuild with verified assetlinks

Once assetlinks.json is live with the correct fingerprint, you can rebuild the TWA if needed. Bubblewrap checks assetlinks during install — if it's missing/wrong, the app may fall back to Custom Tabs instead of fullscreen TWA.

```powershell
cd android
bubblewrap build
```

---

## Step 8 — Publish to Play Store

1. Upload `app-release.aab` to [Google Play Console](https://play.google.com/console)
2. Complete app signing (Play App Signing recommended)
3. Fill in store listing, privacy policy, etc.
4. Submit for review

---

## Testing without Play Store

Install the unsigned APK on a physical device:

```powershell
adb install android/app-release.apk
```

The app should open `https://maulimobile.netlify.app/` in fullscreen standalone mode (no browser address bar).

---

## Important notes

- **TWA requires HTTPS** — Netlify provides this automatically.
- **The domain must match** `host` in `twa-manifest.json` (`maulimobile.netlify.app`).
- If you change the package ID (`com.maulimobile.app`), update `assetlinks.json` and `twa-manifest.json` consistently.
- The app uses localStorage + Firebase fallback when env keys are missing — for production, set `VITE_GROQ_API_KEY`, Firebase, and Razorpay vars in Netlify environment settings.
