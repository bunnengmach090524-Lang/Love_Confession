// Personal settings for the story. Edit the values here (the words live in src/i18n/).
export const CONFIG = {
  // The special date, as YYYY-MM-DD. Used for the "days since" line on the first screen.
  // Set the year to the year it really started.
  startDate: '2026-10-05',

  // Passcode that unlocks the letter: the special date as DDMM (5 October = 0510).
  // Set to '' to remove the lock. NOTE: this is a light, playful lock only —
  // anyone who reads the page source can see it. Never use it for anything private.
  passcode: '0510',

  // Photos for the memory gallery. Put the files in public/photos/ and list the file names here,
  // e.g. ['1.jpg', '2.jpg', '3.jpg']. If the list is empty, the gallery scene is skipped.
  // Captions come from `gallery.captions` in src/i18n/en.js and km.js (matched by position).
  photos: [],

  // Send her answer to you (Telegram) through the /api/notify serverless function.
  // See README → "Get notified". Set to false to turn this off.
  notify: true,
  notifyEndpoint: '/api/notify',
}
