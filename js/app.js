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
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

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
function renderRows() {
  const container = document.getElementById("rows");
  container.innerHTML = "";

  // Flagship always gets its own top row
  container.appendChild(buildRow("The Love Story", [SHOWS.flagship], true));

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
      <span class="card-label">${show.title}</span>
      ${
        show.progress
          ? `<span class="card-progress"><span style="width:${show.progress}%"></span></span>`
          : ""
      }
    `;
    card.addEventListener("click", () => openModal(show));

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
  btn.textContent = dir === "left" ? "‹" : "›";
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
    li.innerHTML = isFlagship
      ? `
        <span class="ep-code">${ep.code}</span>
        <span class="ep-body">
          <span class="ep-title">${ep.title}</span>
          <span class="ep-blurb">${ep.blurb || ""}</span>
        </span>
        <span class="ep-date">${ep.date || ""}</span>
      `
      : `
        <span class="ep-code">${ep.code}</span>
        <span class="ep-body">
          <span class="ep-title">${ep.title}</span>
          <span class="ep-blurb">${ep.blurb || ""}</span>
        </span>
        <span class="ep-duration">${ep.duration || ""}</span>
      `;
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
