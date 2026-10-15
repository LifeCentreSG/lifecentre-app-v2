# Life Centre app v2

A new installable web app (PWA) for Life Centre. Plain HTML, CSS and JavaScript. No build step, no dependencies.
The live app and its Apps Script are not touched by this project.

## Run it locally
    python3 -m http.server 8000      # then open http://localhost:8000  (add ?nosplash to skip the conference pop-up)

## What works today (demo mode, sample data)
- Conference pop-up on first open of each session, and a banner on Home
- Home: stories row + story viewer (audio and video layouts), verse of the day (KJV, rotates daily),
  week strip, your week, pinboard, today's devotion
- Book: email → 6-digit code sign-in (demo code 123456), rooms, new booking (saved as Pending), your bookings
- Contact, News tab greyed out ("Soon")
- Pins need sign-in and show to others only once approved (approval screen for staff is not built yet)
- Light and dark mode, offline helper (sw.js), install manifest

## Files
- `data.js`  all sample content. Everything in [square brackets] is a placeholder to replace.
- `api.js`   the ONLY file that talks to a back end. Set `APPS_SCRIPT_URL` and fill in the calls (next step).
- `app.js`, `styles.css`, `index.html`, `manifest.webmanifest`, `sw.js`, `icons/`

## Still to do
1. Connect `api.js` to a NEW third Apps Script deployment (existing two stay on versions 27 and 26)
2. Real story media (set `src` on a speaker in data.js for audio; YouTube unlisted embed for video)
3. Staff area (approvals, who appears in stories, pin approval) - planned in the profile menu
4. Replace placeholder icons with a larger church logo (current source is 159x58 px)
5. Test on a real iPhone and Android, on a test address, before touching app.lifecentre.sg
