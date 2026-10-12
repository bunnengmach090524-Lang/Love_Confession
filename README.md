# A Little Message for You 💗 (EN / ខ្មែរ)

A mobile-first romantic confession story built with Vue 3 + Vite: an envelope letter (with a passcode), reasons, an optional photo gallery, a typewriter confession, one gentle question, and a happy ending with confetti. Built-in **English / ខ្មែរ** switch.

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

## What it does
- **Music** starts when she taps **Open My Heart** (a tap is allowed by browsers). The ♪ button turns it on/off. If she turns it off herself, it stays off for the rest of the visit. Uses `public/music.mp3`; if that file is missing, a soft generated tune plays instead.
- **Days counter** on the first screen: "It's been N days since 5 October".
- **Passcode** on the envelope: she types the special date as `DDMM` (5 October = `0510`). After two wrong tries a hint appears. It is a playful lock only: anyone who reads the page source can find it.
- **Photo gallery** (optional scene, see below).
- **"Can I think about it?"** hops away up to 3 times, then stays still and works. It never moves for keyboard users or when "reduce motion" is on, so it can't trap her into answering Yes.
- **Yes** → confetti, falling hearts and a short chime (skipped if she turned the music off).
- **Get notified** on Telegram when she answers (see below). The page tells her honestly that her answer is sent to you, and tells her if sending failed.

## Make it yours
| What | Where |
|------|-------|
| Name, all the words (EN) | `src/i18n/en.js` |
| Name, all the words (ខ្មែរ) | `src/i18n/km.js` |
| Special date, passcode, photos, notifications | `src/config.js` |

`npm run check:i18n` lists any key missing from one language, and `npm run build` runs this check automatically.

**Special date:** edit `startDate` (`YYYY-MM-DD`, set the real year) and `passcode` in `src/config.js`. The text "5 October" / "ថ្ងៃទី ៥ តុលា" is in `welcome.days`, `welcome.daysOne` and `letter.gateHint` in both language files, so change it there too if the date changes. Set `passcode: ''` to remove the lock.

**Photos:** copy images into `public/photos/`, list the file names in `photos` in `src/config.js`, and write one caption per photo in `gallery.captions` (both language files). With no photos listed, the gallery scene is skipped.

## Get notified (Telegram)
The bot token must never be in the page code, so a small serverless function (`api/notify.js`) sends the message. It works on Vercel.

1. In Telegram, talk to **@BotFather** → `/newbot` → copy the **bot token**.
2. Open your new bot and press **Start**, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and copy your `chat.id`.
3. In Vercel → Project → **Settings → Environment Variables**, add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (optionally `RECIPIENT_NAME`). See `.env.example`. Redeploy.
4. Open your live link, answer once yourself to test, then you're ready.

`npm run dev` has no `/api`, so on your own computer the ending shows "I couldn't send your answer". That is expected. To turn notifications off completely, set `notify: false` in `src/config.js`; the page then says her choice stays in her browser.

Anyone who finds the `/api/notify` address could send you fake messages. For a private link shared with one person this is a very small risk.

## Project structure
```
api/notify.js                # Telegram notification (Vercel function)
public/music.mp3, photos/    # music and gallery photos
src/
├── config.js                # date, passcode, photos, notify switch
├── App.vue                  # layout + wiring only
├── i18n/                    # en.js, km.js, index.js (useI18n)
├── composables/             # useStory, useTypewriter, useMusic, useSfx, useNotify, useToast
├── components/
│   ├── scenes/              # Welcome, Letter, Reasons, Gallery, Confession, Question, Ending
│   ├── ConfettiBurst.vue, AnimatedBackground.vue, LoveEnvelope.vue, StoryProgress.vue
│   ├── LanguageToggle.vue, ToastMessage.vue
├── utils/days.js
└── styles/                  # main.css, i18n.css (toggle, toast, Khmer type), features.css
```

## Deploy to Vercel
```bash
npm run build
```
Push to GitHub → Vercel **Add New → Project** → framework **Vite** (build `npm run build`, output `dist`) → add the environment variables above → Deploy. Open the HTTPS link on your phone before sending it.

## Notes
- The music file must be a track you have permission to use.
- Animations (including confetti and the hopping button) respect the phone's "reduce motion" setting.
- The typewriter splits text by grapheme, so Khmer letters are never cut in half while typing.
