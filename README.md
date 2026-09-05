# LOVESTREAM

A private Netflix-style site for Lucii & Jaydene. Static HTML/CSS/JS —
no build step, no dependencies (aside from Font Awesome icons loaded
from a CDN).

## Structure

```
index.html      -> the whole app shell (login, profiles, browse, modal, player)
css/style.css   -> all styling
js/shows.js     -> ALL YOUR CONTENT LIVES HERE — this is the file
                   you should mostly need to edit to add shows
js/auth.js      -> the password gate — see "Login gate" below
js/app.js       -> rendering logic, don't need to touch this to add content
assets/
  posters/      -> poster + backdrop images
  videos/       -> video clips (hero, card previews, episode player)
  avatars/      -> the two profile photos
  sounds/       -> click.mp3, played on every button click
```

## Adding a show

Open `js/shows.js`. Every show is an object like this:

```js
{
  id: "unique-id",
  title: "Show Title",
  tagline: "",
  poster: "assets/posters/my-poster.jpg",
  backdrop: "assets/posters/my-backdrop.jpg",
  video: "assets/videos/my-clip.mp4",   // optional — hero/card preview clip
  match: "97% Match",
  year: "2024",
  rating: "16+",
  seasons: "1 Season",
  genres: ["Comedy", "Romance"],
  description: "One to three sentences.",
  cast: ["Lucii", "Jaydene"],
  episodes: [
    {
      code: "S1E01",
      title: "Episode title",
      duration: "22m",
      date: "2024-06-14",             // optional, mainly for the flagship
      video: "assets/videos/ep01.mp4", // optional — see below
      blurb: "..."
    }
  ]
}
```

Paste it into the array for the row you want inside `SHOWS.rows`, or
create a new row by adding a new key.

## The flagship show + episode video player

`SHOWS.flagship` is "The Love Story of Lucii & Jaydene" — it always
gets the hero banner and its own top row. To add a real memory to it:

1. Save the video clip into `assets/videos/`.
2. Add a new object to `SHOWS.flagship.episodes` with a `video` field
   pointing at that file.
3. That's it. In the modal, that episode now shows a play button —
   clicking it opens a full video player (with normal play/pause/
   volume/fullscreen controls) right in the browser. This is meant
   to become a real archive over time, so just keep adding episodes
   as you go.

Episodes without a `video` field just show as text, no play button —
so you can add placeholder episodes before you have the clip ready.

## Login gate

There's a password screen before the profile picker now, in
`js/auth.js`. Read the comment at the top of that file — the short
version:

- **This is not real security.** It's a static site with no server,
  so anyone who opens dev tools can read the code. It's a curtain to
  keep a random person who finds the link from casually poking
  around, not a lock against someone determined. Your actual privacy
  comes from the link being unlisted.
- Default password right now is `ourlovestory` — **change it before
  you send the real link.**
- To set your own: open the site, open the browser console (F12),
  run `await hashPassword("your-new-password")`, copy the string it
  prints, and paste it in as `PASSWORD_HASH` in `js/auth.js`.
- Once someone enters the right password, their browser remembers it
  (`localStorage`) so they won't be asked again on that device.

## Other features

- **Search** — the magnifying glass icon in the top bar opens a
  filter box that live-filters cards by title.
- **My List** — hover a card (or just tap it on mobile) to reveal a
  heart icon; clicking it saves the show to a "My List" row that
  appears near the top. Saved per-browser via `localStorage`.
- **Days together badge** — set `RELATIONSHIP_START_DATE` near the
  top of `shows.js` to a date like `"2023-06-14"` and a "Day 000
  together" badge appears in the top bar. Leave it as `""` to hide it.
- **Click sounds** — drop a sound file into `assets/sounds/` named
  `click.mp3` and every button click plays it automatically.
- **Mobile-friendly** — the whole layout (login, profiles, hero, rows,
  modal, player) adapts down to small phone screens.

## Poster/backdrop/video images

- Posters: portrait, roughly 2:3 ratio (e.g. 500x750px).
- Backdrops: wide, roughly 16:9 or wider (e.g. 1600x900px).
- Leave `poster`/`backdrop`/`video` as `""` if you don't have one yet
  — the site falls back to a dark placeholder gradient automatically,
  it never looks broken mid-content-gathering.

## Running locally

No build tools needed.

```
cd lovestream       # the folder with index.html directly inside it
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. (Must be run from *inside* the
`lovestream` folder — running it one level up will 404 every image.)

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo (can be public — there's a
   `noindex, nofollow` meta tag so search engines won't index it, but
   the URL itself isn't private, so treat the link like a password
   and don't post it anywhere public).
2. In repo settings → Pages, set the source to your main branch (root).
3. Site goes live at `https://<username>.github.io/<repo>/`.

GitHub Pages doesn't support real access control on the free tier —
the login gate above is the practical workaround, combined with
keeping the link unlisted.
