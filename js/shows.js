/* ============================================================
   SHOWS.JS — this is the only file you should need to touch
   to add new "shows" to the site.

   HOW TO ADD A SHOW:
   Copy one of the objects below, paste it into the right
   category array, and fill in your own details. That's it.

   Fields:
     id          - unique short string, no spaces (used internally)
     title       - show title
     tagline     - one short line under the title (optional)
     poster      - path to poster image, e.g. "assets/posters/xyz.jpg"
                   (leave as "" to use an auto-generated placeholder)
     backdrop    - path to wide banner image (used for hero + modal,
                   and as the still frame shown before video plays)
     video       - OPTIONAL. path to a short mp4 clip, e.g.
                   "assets/videos/xyz.mp4". If set, this autoplays
                   (muted, looped) in the hero when it's the flagship,
                   and plays a hover-preview on the card after a short
                   delay, like Netflix. Leave "" or omit if you don't
                   have a clip for that show yet — it'll just show the
                   backdrop/poster image instead.
     match       - "match %" badge, e.g. "100% Match"
     year        - release year / year tag, e.g. "2023"
     rating      - age-rating style badge, e.g. "18+" or "Us"
     seasons     - number of seasons (string is fine, e.g. "1 Season")
     genres      - array of genre tags, e.g. ["Romance", "Comedy"]
     description - 1-3 sentence synopsis
     cast        - array of strings
     episodes    - array of episode objects:
         { code: "S1E01", title: "...", duration: "...",
           date: "2023-06-14", blurb: "...", video: "assets/videos/xyz.mp4" }
         (date is optional — used for the commit-log style metadata
          on the flagship show. video is optional — if set, a play
          button appears on that episode row and clicking it opens
          a full video player, so you can build up a real archive of
          memories on the flagship show over time.)

   POSTERS: Don is generating these with Gemini — once a poster/backdrop
   is ready, just drop the file into assets/posters/ and set the path
   below. Leave "" until then; it'll fall back to a dark placeholder.
   ============================================================ */

/* Set this to the date you two got together (YYYY-MM-DD) to show a
   "Day 000 together" badge in the top bar. Leave it as "" to hide it. */
const RELATIONSHIP_START_DATE = "2025-12-22";

const SHOWS = {

  /* ----------------------------------------------------------
     FLAGSHIP SHOW — always rendered as the top hero + top row
     ---------------------------------------------------------- */
  flagship: {
    id: "love-story",
    title: "The Love Story of Lucii & Jaydene",
    tagline: "A lifetime project. Currently in production.",
    poster: "assets/posters/thelovestory.jpeg",
    backdrop: "assets/posters/thelovestory.jpeg",
    video: "assets/videos/thelovestory.mp4",
    match: "100% Match",
    year: "Ongoing",
    rating: "Us",
    seasons: "Season 1: Year One",
    genres: ["Romance", "Documentary", "Comedy", "Ongoing Series"],
    description:
      "Two people, one running joke that never dies, and a story that " +
      "started somewhere ordinary and hasn't stopped since. Renewed " +
      "every year, indefinitely.",
    cast: ["Lucii", "Jaydene"],
    episodes: [
      {
        code: "S1E01",
        title: "The Pilot Episode",
        duration: "A few days",
        date: "12 June 2025",
        video: "assets/videos/thelovestory.mp4",
        blurb: "Where it all began. We take a look at where the story started before the current events"
      }
    ]
  },

  /* ----------------------------------------------------------
     ROWS — each key becomes a horizontal row on the browse page.
     Row order below = row order on the page.
     ---------------------------------------------------------- */
  rows: {

    "Our Comedies": [
      {
        id: "too-bad-too-sad",
        title: "Too Bad, Too Sad",
        tagline: "Bad, sad, glad, Vlad.",
        poster: "assets/posters/verysad.jpeg",
        backdrop: "",
        match: "98% Match",
        year: "2023",
        rating: "PG",
        seasons: "1 Season",
        genres: ["Comedy", "Sketch"],
        description:
          "An unscripted running bit where every sentence has to rhyme " +
          "with 'bad' — bad, sad, glad, Vlad, and whatever else fits. " +
          "No plot. No end goal. Just chaos and rhyme scheme commitment.",
        cast: ["Lucii", "Jaydene"],
        episodes: [
          { code: "S1E01", title: "The Rhyme Never Dies", duration: "12m", blurb: "The one where it started and never really stopped." }
        ]
      },
      {
        id: "big-back-big-back",
        title: "Big Back, Big Back",
        tagline: "A love letter to snacks.",
        poster: "assets/posters/bigback.jpeg",
        backdrop: "",
        match: "95% Match",
        year: "2023",
        rating: "PG",
        seasons: "1 Season",
        genres: ["Comedy", "Food"],
        description:
          "A docuseries about two people and their shared, unshakable " +
          "devotion to pastries, snacks, and anything baked well enough " +
          "to justify the title.",
        cast: ["Lucii", "Jaydene"],
        episodes: [
          { code: "S1E01", title: "Big Back Origins", duration: "18m", blurb: "How the name happened and why it stuck." }
        ]
      },
      {
        id: "mr-and-mrs-west",
        title: "Mr and Mrs West",
        tagline: "Not Ye and Kim. An inside joke.",
        poster: "assets/posters/mrandmrswest.jpeg",
        backdrop: "",
        match: "93% Match",
        year: "2023",
        rating: "PG",
        seasons: "1 Season",
        genres: ["Comedy"],
        description:
          "A sitcom built entirely on a running pet-name bit — no relation " +
          "to any famous Wests, just two people with too many nicknames " +
          "for each other, this being one of them.",
        cast: ["Lucii", "Jaydene"],
        episodes: [
          { code: "S1E01", title: "How We Got The Name", duration: "15m", blurb: "The origin of yet another nickname." }
        ]
      },
      {
        id: "pepper-steak-vs-sausage-roll",
        title: "Pepper Steak vs Sausage Roll",
        tagline: "The ultimate pie rivalry.",
        poster: "assets/posters/psvssr.jpeg",
        backdrop: "",
        match: "91% Match",
        year: "2024",
        rating: "PG",
        seasons: "1 Season",
        genres: ["Comedy", "Food", "Competition"],
        description:
          "A head-to-head culinary rivalry between two favourite pies. " +
          "No judges. No real winner. Just two very strong, very " +
          "recurring opinions.",
        cast: ["Lucii", "Jaydene"],
        episodes: [
          { code: "S1E01", title: "Round One", duration: "10m", blurb: "The debate that never actually gets settled." }
        ]
      }
    ],

    "Romance & Drama": [
      {
        id: "a-rose-for-every-breath",
        title: "A Rose for Every Breath",
        tagline: "A line borrowed from Mrs Me.",
        poster: "assets/posters/arose.jpeg",
        backdrop: "",
        match: "99% Match",
        year: "2023",
        rating: "13+",
        seasons: "1 Season",
        genres: ["Romance", "Drama"],
        description:
          "Named after a line from Nasty C's 'Mrs Me' — her favourite " +
          "artist, and a small dig she'll appreciate. A quiet, romantic " +
          "arc built around one lyric that stuck.",
        cast: ["Lucii", "Jaydene"],
        episodes: [
          { code: "S1E01", title: "Mrs Me", duration: "14m", blurb: "Where the title actually comes from." }
        ]
      },
     
    ],

    "Lifestyle & Style": [
      {
        id: "fashion-killa",
        title: "Fashion Killa",
        tagline: "She dresses better than I ever will.",
        poster: "assets/posters/fashionkilla.jpeg",
        backdrop: "",
        match: "94% Match",
        year: "2024",
        rating: "PG",
        seasons: "1 Season",
        genres: ["Lifestyle", "Fashion"],
        description:
          "A style docuseries about one very well-dressed woman, and " +
          "one boyfriend who openly admits he's still catching up.",
        cast: ["Jaydene"],
        episodes: [
          { code: "S1E01", title: "Out Of My League, Fashion-Wise", duration: "9m", blurb: "A confession disguised as an episode." }
        ]
      },
      {
        id: "love-in-a-bottle",
        title: "Love In A Bottle",
        tagline: "Hot chocolate, Ice Tea, Grapetiser, Litchi water.",
        poster: "assets/posters/loveinabottle.jpeg",
        backdrop: "",
        match: "90% Match",
        year: "2023",
        rating: "PG",
        seasons: "1 Season",
        genres: ["Lifestyle", "Food"],
        description:
          "A shameless tour of shared favourite drinks — hot chocolate, " +
          "Lipton Ice Tea, Grapetiser, and litchi-flavoured water, in " +
          "no particular order of importance.",
        cast: ["Lucii", "Jaydene"],
        episodes: [
          { code: "S1E01", title: "The Fridge Tour", duration: "7m", blurb: "What's always stocked, and why." }
        ]
      }
    ],

    "Our Reality": [
      {
        id: "meet-the-ladinos",
        title: "Meet The Ladinos",
        tagline: "Don Ladino. Donna. Unofficially wifed.",
        poster: "assets/posters/meettheladinos.jpeg",
        backdrop: "",
        match: "98% Match",
        year: "2024",
        rating: "PG",
        seasons: "1 Season",
        genres: ["Reality", "Comedy"],
        description:
          "A reality-show send-up following Don Ladino and his Donna — " +
          "practically married in every way that counts, official " +
          "paperwork pending.",
        cast: ["Lucii (Don Ladino)", "Jaydene (Donna Ladino)"],
        episodes: [
          { code: "S1E01", title: "Meet The Family", duration: "21m", blurb: "Introducing the Ladinos, sort of." }
        ]
      }
    ],

    "Sci-Fi & Fantasy": [
      {
        id: "home-is-where-the-heart-is",
        title: "Home Is Where The Heart Is",
        tagline: "Lucy and David, Night City.",
        poster: "assets/posters/homeiswheretheheartis.jpeg",
        backdrop: "",
        match: "97% Match",
        year: "2024",
        rating: "16+",
        seasons: "1 Season",
        genres: ["Sci-Fi", "Romance"],
        description:
          "A neon-soaked homage to Cyberpunk: Edgerunners' Lucy and " +
          "David — star-crossed, high-stakes, and looking for something " +
          "steady in a chaotic world.",
        cast: ["Lucii as Lucy", "Jaydene as David"],
        episodes: [
          { code: "S1E01", title: "Night City", duration: "24m", blurb: "Two people, one impossible city, one shot at something real." }
        ]
      }
    ]

  }
};
