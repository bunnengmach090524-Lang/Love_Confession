# A Little Message for You 💗 (EN / ខ្មែរ)

A mobile-first romantic confession story built with Vue 3 + Vite. Six animated scenes, an envelope-opening letter, a typewriter confession, optional music, a respectful answer screen, and a built-in **English / ខ្មែរ** language switch.

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

## Make it yours (text)
All the words live in two files:

| File | Language |
|------|----------|
| `src/i18n/en.js` | English |
| `src/i18n/km.js` | ខ្មែរ |

- Change `recipient` to her nickname (in both files).
- Edit `reasons.items` (3 reasons) and `confession.text` in your own words.
- Keep both files in sync. `npm run check:i18n` lists any key missing from one language, and `npm run build` runs this check automatically.
- The page opens in Khmer if the phone's language is Khmer, otherwise English. She can switch with the EN | ខ្មែរ button and the choice is remembered.

## Project structure
```
src/
├── App.vue                  # layout + wiring only
├── i18n/                    # en.js, km.js, index.js (useI18n)
├── composables/             # useStory (navigation), useTypewriter, useMusic, useToast
├── components/
│   ├── scenes/              # one file per scene (Welcome, Letter, Reasons, Confession, Question, Ending)
│   ├── AnimatedBackground.vue, LoveEnvelope.vue, StoryProgress.vue
│   ├── LanguageToggle.vue, ToastMessage.vue
└── styles/                  # main.css (design), i18n.css (toggle, toast, Khmer typography)
```

## Optional music
Put a file you have permission to use at `public/music.mp3`. Until it exists, the music button shows a gentle "music isn't ready yet" message. Browsers only play audio after a tap.

## Deploy to Vercel
```bash
npm run build
```
Push to GitHub → Vercel **Add New → Project** → framework **Vite** (build `npm run build`, output `dist`) → Deploy. Open the HTTPS link on your phone before sending it.

## Notes
- The answer buttons only change what she sees. You are **not** notified of her choice.
- Animations respect the phone's "reduce motion" setting.
- The typewriter splits text by grapheme, so Khmer letters are never cut in half while typing.

## Get her answer on Telegram
When she taps an answer, the page calls `/api/notify` (a Vercel serverless function in `api/notify.js`), which sends you a Telegram message. The question screen tells her you will receive it.

1. In Telegram, talk to **@BotFather** → `/newbot` → copy the **bot token**.
2. Open your new bot and press **Start** (send it any message).
3. Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` and copy `"chat":{"id": ...}` (your **chat id**).
4. In Vercel → Project → **Settings → Environment Variables**, add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`, then **redeploy**.
5. Test by choosing an answer on the live link yourself.

Rules: never put the token in `src/` or commit it to GitHub (`.env` is git-ignored; `.env.example` shows the names only). If the token ever leaks, revoke it with BotFather (`/revoke`). `npm run dev` doesn't run `/api`; use `npx vercel dev` to test locally.

## Secret word (password) on the envelope
The envelope is locked until she types the secret word. The word is checked on the server (`api/unlock.js`), so it is not written anywhere in the website code.

1. In Vercel → Settings → Environment Variables add **`SITE_PASSWORD`** (for example `sunflower`). You can allow several spellings with commas: `sunflower,sun flower`. Capital letters and extra spaces don't matter.
2. **Redeploy**, then test it yourself before sending the link. If `SITE_PASSWORD` is missing, nobody can open the letter.
3. Change the hint she sees in `src/i18n/en.js` and `src/i18n/km.js` (`letter.hint`). Use `''` for no hint.

This is a cute lock, not bank security: the letter text is still inside the website files.

## "Can I think about it?" and her message
- The button playfully runs away (tilts, shrinks, hops) when she hovers or taps it. After `MAX_DODGES` tries (3, in `src/components/scenes/QuestionScene.vue`) it comes back and can be chosen. Set it to `0` to turn the game off. It never covers the "Yes" button, and it stays still for people who use "reduce motion".
- If she chooses it, a box lets her write an optional message. It is sent to your Telegram, and the page tells her so.
