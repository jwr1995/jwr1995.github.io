# Stag Bingo

Drop this whole `sb-4f9x2q/` folder into the root of the
`jwr1995.github.io` repo, commit, push.

Live at: https://jwr1995.github.io/sb-4f9x2q/

- The page is behind a password screen. Not real security, just
  enough that it isn't sat wide open for anyone who finds the URL.
  Correct entry is remembered per-device.
- Players then type their first name to get their card.
- Marked squares are saved on their own device.
- Organiser view (tab bar + print all seven): add `?all` to the URL.
- Printing: A4 landscape, two A5 cards per sheet, four sheets.
  Turn on "Background graphics" so the centre photo prints.

The centre photo (`tom.enc`) is AES-256-GCM encrypted with a key
derived from the page password, and is decrypted in the browser after
a correct entry — there's no plain image file sitting on the server.

Everything is one static page. No build step, no dependencies.
Does not affect the rest of the site.
