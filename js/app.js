/* ============================================================
   APP.JS — rendering + interaction logic.
   You shouldn't need to edit this to add content — edit shows.js.
   ============================================================ */

const PROFILES = [
  { name: "Lucii", color: "#C81D3F", avatar: "assets/avatars/lucii.jpeg" },
  { name: "Jaydene", color: "#D9A441", avatar: "assets/avatars/jaydene.jpeg" }
];

const state = { profile: null };

const HOVER_PREVIEW_DELAY = 700; // ms before a card's video starts, Netflix-style

/* ---------- sound ---------- */
function playClick() {
  const sound = document.getElementById("click-sound");
  if (!sound) return;
  try {
    sound.currentTime = 0;
    sound.play().catch(() => {}); // browsers block autoplay until first interaction; ignore
  } catch (e) {}
}

// Any click anywhere on a button plays the click sound, so you don't
// have to wire it into every handler by hand.
document.addEventListener("click", (e) => {
  if (e.target.closest("button")) playClick();
});

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProfiles();
  renderDaysTogether();

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") closeModal();
  });

  document.getElementById("player-close").addEventListener("click", closeEpisodePlayer);
  document.getElementById("player-overlay").addEventListener("click", (e) => {
    if (e.target.id === "player-overlay") closeEpisodePlayer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const playerOpen = !document.getElementById("player-overlay").classList.contains("hidden");
    if (playerOpen) {
      closeEpisodePlayer();
    } else {
      closeModal();
    }
  });

  // search
  const searchToggle = document.getElementById("search-toggle");
  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");
  searchToggle.addEventListener("click", () => {
    searchBar.classList.toggle("hidden");
    if (!searchBar.classList.contains("hidden")) searchInput.focus();
    else {
      searchInput.value = "";
      applySearchFilter("");
    }
  });
  searchInput.addEventListener("input", (e) => applySearchFilter(e.target.value));
});

/* ---------- days together badge ---------- */
function renderDaysTogether() {
  const el = document.getElementById("days-together");
  if (!RELATIONSHIP_START_DATE) return;
  const start = new Date(RELATIONSHIP_START_DATE + "T00:00:00");
  if (isNaN(start.getTime())) return;
  const days = Math.floor((Date.now() - start.getTime()) / 86400000);
  el.textContent = `Day ${days} together`;
  el.classList.remove("hidden");
}

/* ---------- search ---------- */
function applySearchFilter(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll("#rows .row").forEach((rowEl) => {
    let anyVisible = false;
    rowEl.querySelectorAll(".card").forEach((cardEl) => {
      const label = cardEl.querySelector(".card-label")?.textContent.toLowerCase() || "";
      const match = q === "" || label.includes(q);
      cardEl.style.display = match ? "" : "none";
      if (match) anyVisible = true;
    });
    rowEl.style.display = anyVisible ? "" : "none";
  });
}

/* ---------- profile picker ---------- */
function renderProfiles() {
  const wrap = document.getElementById("profile-grid");
  wrap.innerHTML = "";
  PROFILES.forEach((p) => {
    const el = document.createElement("button");
    el.className = "profile";
    el.innerHTML = `
      <span class="profile-avatar" style="background:${p.color}">
        <span class="profile-avatar-letter">${p.name.charAt(0)}</span>
        ${p.avatar ? `<img src="${p.avatar}" alt="" class="profile-avatar-img" onerror="this.style.display='none'" />` : ""}
      </span>
      <span class="profile-name">${p.name}</span>
    `;
    el.addEventListener("click", () => selectProfile(p.name));
    wrap.appendChild(el);
  });
}

function selectProfile(name) {
  state.profile = name;
  document.getElementById("screen-profiles").classList.add("hidden");
  document.getElementById("screen-browse").classList.remove("hidden");
  document.getElementById("whoami").textContent = name;
  renderHero();
  renderRows();
}

/* ---------- hero ---------- */
function renderHero() {
  const f = SHOWS.flagship;
  const hero = document.getElementById("hero");
  if (f.backdrop) {
    hero.style.backgroundImage = `url("${f.backdrop}")`;
  } else {
    hero.style.backgroundImage = "";
  }

  const heroVideo = document.getElementById("hero-video");
  if (f.video) {
    heroVideo.src = f.video;
    heroVideo.classList.remove("hidden");
    heroVideo.play().catch(() => {}); // ignore autoplay-block errors
  } else {
    heroVideo.classList.add("hidden");
    heroVideo.removeAttribute("src");
  }
  document.getElementById("hero-title").textContent = f.title;
  document.getElementById("hero-tagline").textContent = f.tagline;
  document.getElementById("hero-desc").textContent = f.description;
  document.getElementById("hero-meta").innerHTML = `
    <span class="tag tag-match">${f.match}</span>
    <span>${f.seasons}</span>
    <span class="tag tag-rating">${f.rating}</span>
  `;
  document.getElementById("hero-play").addEventListener("click", () => openModal(f));
  document.getElementById("hero-info").addEventListener("click", () => openModal(f));
}

/* ---------- rows ---------- */
const SAVED_KEY = "lovestream_saved";

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function isSaved(id) {
  return getSavedIds().includes(id);
}

function toggleSaved(id, btnEl) {
  let ids = getSavedIds();
  if (ids.includes(id)) {
    ids = ids.filter((x) => x !== id);
    btnEl.classList.remove("saved");
    btnEl.querySelector("i").className = "fa-regular fa-heart";
  } else {
    ids.push(id);
    btnEl.classList.add("saved");
    btnEl.querySelector("i").className = "fa-solid fa-heart";
  }
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  renderRows(); // rebuild so "My List" row stays in sync
}

function getAllShowsFlat() {
  const all = [SHOWS.flagship];
  Object.values(SHOWS.rows).forEach((arr) => all.push(...arr));
  return all;
}

function renderRows() {
  const container = document.getElementById("rows");
  container.innerHTML = "";

  // Flagship always gets its own top row
  container.appendChild(buildRow("The Love Story", [SHOWS.flagship], true));

  const savedIds = getSavedIds();
  if (savedIds.length > 0) {
    const savedShows = getAllShowsFlat().filter((s) => savedIds.includes(s.id));
    if (savedShows.length > 0) {
      container.appendChild(buildRow("My List", savedShows, false));
    }
  }

  Object.entries(SHOWS.rows).forEach(([rowName, shows]) => {
    if (!shows || shows.length === 0) return;
    container.appendChild(buildRow(rowName, shows, false));
  });
}

function buildRow(name, shows, isFlagshipRow) {
  const section = document.createElement("section");
  section.className = "row";

  const heading = document.createElement("h2");
  heading.className = "row-title";
  heading.textContent = name;
  section.appendChild(heading);

  const track = document.createElement("div");
  track.className = "row-track";

  shows.forEach((show) => {
    const card = document.createElement("button");
    card.className = "card" + (isFlagshipRow ? " card-flagship" : "");

    card.innerHTML = `
      <span class="card-art"></span>
      ${show.video ? `<video class="card-video" muted loop playsinline src="${show.video}"></video>` : ""}
      <button class="card-save" aria-label="Save to My List" data-id="${show.id}">
        <i class="fa-regular fa-heart"></i>
      </button>
      <span class="card-label">${show.title}</span>
      ${
        show.progress
          ? `<span class="card-progress"><span style="width:${show.progress}%"></span></span>`
          : ""
      }
    `;
    card.addEventListener("click", () => openModal(show));

    const saveBtn = card.querySelector(".card-save");
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSaved(show.id, saveBtn);
    });
    if (isSaved(show.id)) {
      saveBtn.classList.add("saved");
      saveBtn.querySelector("i").className = "fa-solid fa-heart";
    }

    const artEl = card.querySelector(".card-art");
    if (show.poster) {
      artEl.style.backgroundImage = `url("${show.poster}")`;
    }

    if (show.video) {
      const vid = card.querySelector(".card-video");
      let hoverTimer = null;
      card.addEventListener("mouseenter", () => {
        hoverTimer = setTimeout(() => {
          vid.currentTime = 0;
          vid.play().catch(() => {});
          vid.classList.add("playing");
        }, HOVER_PREVIEW_DELAY);
      });
      card.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimer);
        vid.pause();
        vid.classList.remove("playing");
      });
    }

    track.appendChild(card);
  });

  section.appendChild(track);

  const leftBtn = arrowBtn("left", () => (track.scrollLeft -= track.clientWidth * 0.8));
  const rightBtn = arrowBtn("right", () => (track.scrollLeft += track.clientWidth * 0.8));
  section.appendChild(leftBtn);
  section.appendChild(rightBtn);

  return section;
}

function arrowBtn(dir, onClick) {
  const btn = document.createElement("button");
  btn.className = `row-arrow row-arrow-${dir}`;
  btn.setAttribute("aria-label", dir === "left" ? "Scroll left" : "Scroll right");
  btn.innerHTML = `<i class="fa-solid fa-chevron-${dir}"></i>`;
  btn.addEventListener("click", onClick);
  return btn;
}

/* ---------- modal ---------- */
function openModal(show) {
  const backdrop = document.getElementById("modal-backdrop");
  document.getElementById("modal-title").textContent = show.title;
  document.getElementById("modal-desc").textContent = show.description;
  document.getElementById("modal-cast").textContent = show.cast
    ? `Starring: ${show.cast.join(", ")}`
    : "";
  document.getElementById("modal-meta").innerHTML = `
    <span class="tag tag-match">${show.match || ""}</span>
    <span>${show.year || ""}</span>
    <span class="tag tag-rating">${show.rating || ""}</span>
    <span>${show.seasons || ""}</span>
  `;
  document.getElementById("modal-genres").textContent = (show.genres || []).join(" · ");
  const modalArt = document.getElementById("modal-art");
  if (show.backdrop) {
    modalArt.style.backgroundImage = `url("${show.backdrop}")`;
    modalArt.style.backgroundSize = "cover";
    modalArt.style.backgroundPosition = "center";
  } else {
    modalArt.style.backgroundImage = "";
  }

  const modalVideo = document.getElementById("modal-video");
  if (show.video) {
    modalVideo.src = show.video;
    modalVideo.classList.remove("hidden");
    modalVideo.play().catch(() => {});
  } else {
    modalVideo.pause();
    modalVideo.classList.add("hidden");
    modalVideo.removeAttribute("src");
  }

  const isFlagship = show.id === SHOWS.flagship.id;
  const epList = document.getElementById("modal-episodes");
  epList.innerHTML = "";
  epList.classList.toggle("commit-log", isFlagship);

  (show.episodes || []).forEach((ep) => {
    const li = document.createElement("li");
    li.className = "episode";
    const playBtn = ep.video
      ? `<button class="episode-play" aria-label="Play ${ep.title}"><i class="fa-solid fa-circle-play"></i></button>`
      : "";
    li.innerHTML = isFlagship
      ? `
        ${playBtn}
        <span class="ep-code">${ep.code}</span>
        <span class="ep-body">
          <span class="ep-title">${ep.title}</span>
          <span class="ep-blurb">${ep.blurb || ""}</span>
        </span>
        <span class="ep-date">${ep.date || ""}</span>
      `
      : `
        ${playBtn}
        <span class="ep-code">${ep.code}</span>
        <span class="ep-body">
          <span class="ep-title">${ep.title}</span>
          <span class="ep-blurb">${ep.blurb || ""}</span>
        </span>
        <span class="ep-duration">${ep.duration || ""}</span>
      `;
    if (ep.video) {
      li.querySelector(".episode-play").addEventListener("click", () => openEpisodePlayer(show, ep));
    }
    epList.appendChild(li);
  });

  backdrop.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal() {
  document.getElementById("modal-backdrop").classList.add("hidden");
  document.body.classList.remove("modal-open");
  const modalVideo = document.getElementById("modal-video");
  modalVideo.pause();
}

/* ---------- episode player (memories archive) ---------- */
function openEpisodePlayer(show, ep) {
  const overlay = document.getElementById("player-overlay");
  const video = document.getElementById("player-video");
  video.src = ep.video;
  video.currentTime = 0;
  overlay.classList.remove("hidden");
  document.body.classList.add("modal-open");
  video.play().catch(() => {});

  document.getElementById("player-title").textContent = ep.title;
  document.getElementById("player-sub").textContent =
    `${show.title} — ${ep.code}${ep.date ? " — " + ep.date : ""}`;
}

function closeEpisodePlayer() {
  const overlay = document.getElementById("player-overlay");
  const video = document.getElementById("player-video");
  video.pause();
  video.removeAttribute("src");
  overlay.classList.add("hidden");
  document.body.classList.remove("modal-open");
}
