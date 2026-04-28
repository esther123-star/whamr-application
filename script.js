/* ============================================
   whamr · script.js
   Works across pages: index (featured), memes (full library), how-it-works (no grid)
   ============================================ */

(function () {
  "use strict";

  /* ---------- which page are we on ---------- */
  const PAGE = window.__WHAMR_PAGE || "library";
  const HAS_GRID = PAGE === "home" || PAGE === "library";
  const IS_HOME = PAGE === "home";
  const IS_LIBRARY = PAGE === "library";

  /* ---------- state ---------- */
  const state = {
    memes: [],
    jsonMemes: [],
    uploadedMemes: [],
    favorites: new Set(),
    activeCategory: "all",
    searchQuery: "",
    currentModal: null,
    featuredIds: null, // set on homepage from data-featured-ids
  };

  /* ---------- dom refs (some may be null on certain pages) ---------- */
  const $ = (id) => document.getElementById(id);
  const el = {
    grid: $("grid"),
    empty: $("empty"),
    emptyTitle: $("empty-title"),
    emptySub: $("empty-sub"),
    loading: $("loading"),
    search: $("search"),
    filters: $("filters"),
    count: $("count"),
    totalCount: $("total-count"),
    upload: $("upload"),
    modal: $("modal"),
    modalBackdrop: $("modal-backdrop"),
    modalClose: $("modal-close"),
    modalMedia: $("modal-media"),
    modalTitle: $("modal-title"),
    modalCategory: $("modal-category"),
    modalType: $("modal-type"),
    modalTags: $("modal-tags"),
    btnShare: $("btn-share"),
    btnFavorite: $("btn-favorite"),
    favIcon: $("fav-icon"),
    favLabel: $("fav-label"),
    btnDownload: $("btn-download"),
    btnDelete: $("btn-delete"),
    shareSheet: $("share-sheet"),
    shareBackdrop: $("share-backdrop"),
    shareClose: $("share-close"),
    shareGrid: $("share-grid"),
    toast: $("toast"),
  };

  /* ============================================
     Favorites — localStorage
     ============================================ */
  const FAV_KEY = "whamr-favorites";

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) state.favorites = new Set(JSON.parse(raw));
    } catch (e) {
      state.favorites = new Set();
    }
  }
  function saveFavorites() {
    try { localStorage.setItem(FAV_KEY, JSON.stringify([...state.favorites])); } catch (e) {}
  }
  function toggleFavorite(id) {
    if (state.favorites.has(id)) { state.favorites.delete(id); saveFavorites(); return false; }
    state.favorites.add(id); saveFavorites(); return true;
  }
  function isFavorited(id) { return state.favorites.has(id); }

  /* ============================================
     IndexedDB for uploads
     ============================================ */
  const DB_NAME = "whamr-db";
  const DB_VERSION = 1;
  const STORE = "memes";

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      };
    });
  }
  async function dbGetAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }
  async function dbAdd(item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).add(item);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  async function dbDelete(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /* ============================================
     Load memes
     ============================================ */
  async function loadMemes() {
    try {
      const res = await fetch("data/memes.json", { cache: "no-store" });
      if (!res.ok) throw new Error("failed to fetch memes.json");
      state.jsonMemes = await res.json();
    } catch (err) {
      console.warn("Could not load memes.json:", err);
      state.jsonMemes = [];
    }

    // Only load uploads on the library page (where they're shown)
    if (IS_LIBRARY) {
      try {
        const uploaded = await dbGetAll();
        state.uploadedMemes = uploaded.map((u) => ({
          ...u,
          src: URL.createObjectURL(u.blob),
          uploaded: true,
        }));
      } catch (err) {
        state.uploadedMemes = [];
      }
    }

    state.memes = [...state.uploadedMemes, ...state.jsonMemes];

    // On homepage, only keep featured
    if (IS_HOME && el.grid) {
      const idsAttr = el.grid.getAttribute("data-featured-ids");
      if (idsAttr) {
        state.featuredIds = idsAttr.split(",").map(s => s.trim());
        const featuredMap = new Map(state.memes.map(m => [m.id, m]));
        state.memes = state.featuredIds
          .map(id => featuredMap.get(id))
          .filter(Boolean);
      }
    }

    // Update total-count if it's on the page
    if (el.totalCount) el.totalCount.textContent = state.jsonMemes.length;
  }

  /* ============================================
     Categories / filter pills (library only)
     ============================================ */
  function computeCategories() {
    const set = new Set();
    state.memes.forEach((m) => m.category && set.add(m.category.toLowerCase()));
    return ["all", "favorites", ...Array.from(set).sort()];
  }

  function renderFilters() {
    if (!el.filters) return;
    const categories = computeCategories();
    el.filters.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "pill" + (cat === state.activeCategory ? " active" : "");
      if (cat === "favorites") btn.classList.add("favorites-pill");
      if (cat === "favorites") {
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="${state.activeCategory === "favorites" ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>Favorites</span>
          <span class="pill-count">${state.favorites.size}</span>
        `;
      } else {
        btn.textContent = cat;
      }
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", cat === state.activeCategory);
      btn.addEventListener("click", () => {
        state.activeCategory = cat;
        renderFilters();
        renderGrid();
      });
      el.filters.appendChild(btn);
    });
  }

  /* ============================================
     Filter + search
     ============================================ */
  function getFilteredMemes() {
    const q = state.searchQuery.trim().toLowerCase();
    return state.memes.filter((m) => {
      if (state.activeCategory === "favorites") {
        if (!isFavorited(m.id)) return false;
      } else if (state.activeCategory !== "all") {
        if ((m.category || "").toLowerCase() !== state.activeCategory) return false;
      }
      if (q) {
        const hay = [m.title || "", m.category || "", (m.tags || []).join(" ")]
          .join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  /* ============================================
     Render grid
     ============================================ */
  function renderGrid() {
    if (!el.grid) return;
    const list = (IS_HOME) ? state.memes : getFilteredMemes(); // home shows all featured (no filter UI)
    el.grid.innerHTML = "";

    if (el.count) el.count.textContent = list.length === 1 ? "1 meme" : `${list.length} memes`;
    if (el.loading) el.loading.hidden = true;

    if (list.length === 0) {
      if (el.empty) {
        el.empty.hidden = false;
        if (state.activeCategory === "favorites") {
          if (el.emptyTitle) el.emptyTitle.textContent = "No favorites yet";
          if (el.emptySub) el.emptySub.textContent = "Tap the heart on any meme to save it here.";
        } else {
          if (el.emptyTitle) el.emptyTitle.textContent = "No memes found";
          if (el.emptySub) el.emptySub.textContent = "Try a different search, switch categories, or upload your own.";
        }
      }
      return;
    }
    if (el.empty) el.empty.hidden = true;

    const frag = document.createDocumentFragment();
    list.forEach((m, i) => frag.appendChild(createCard(m, i)));
    el.grid.appendChild(frag);
  }

  function createCard(meme, index) {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = Math.min(index * 30, 400) + "ms";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Preview ${meme.title}`);

    const badge = document.createElement("div");
    badge.className = "card-badge " + meme.type;
    badge.textContent = meme.type;
    card.appendChild(badge);

    const heart = document.createElement("button");
    heart.className = "card-fav" + (isFavorited(meme.id) ? " is-favorited" : "");
    heart.setAttribute("aria-label", "Add to favorites");
    heart.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${isFavorited(meme.id) ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;
    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(meme.id);
      heart.classList.toggle("is-favorited", nowFav);
      heart.querySelector("svg").setAttribute("fill", nowFav ? "currentColor" : "none");
      heart.classList.remove("heart-burst");
      void heart.offsetWidth;
      heart.classList.add("heart-burst");
      if (state.activeCategory === "favorites" && !nowFav) {
        setTimeout(() => renderGrid(), 200);
      }
      renderFilters();
      showToast(nowFav ? "Saved to favorites" : "Removed from favorites");
    });
    card.appendChild(heart);

    if (meme.uploaded) {
      const tag = document.createElement("div");
      tag.className = "card-uploaded-tag";
      tag.textContent = "yours";
      card.appendChild(tag);
    }

    const media = createMedia(meme, { forCard: true });
    card.appendChild(media);

    const overlay = document.createElement("div");
    overlay.className = "card-overlay";
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = meme.title;
    overlay.appendChild(title);
    if (meme.category) {
      const sub = document.createElement("div");
      sub.className = "card-subtitle";
      sub.textContent = meme.category;
      overlay.appendChild(sub);
    }
    card.appendChild(overlay);

    card.addEventListener("click", () => openModal(meme));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(meme); }
    });

    if (meme.type === "mp4") {
      card.addEventListener("mouseenter", () => { media.play().catch(() => {}); });
      card.addEventListener("mouseleave", () => { media.pause(); media.currentTime = 0; });
    }

    return card;
  }

  function createMedia(meme, opts = {}) {
    const { forCard } = opts;
    if (meme.type === "mp4") {
      const v = document.createElement("video");
      v.className = forCard ? "card-media" : "";
      v.src = meme.src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "metadata";
      if (!forCard) v.controls = true;
      return v;
    }
    const img = document.createElement("img");
    img.className = forCard ? "card-media" : "";
    img.src = meme.src;
    img.alt = meme.title || "meme";
    img.loading = "lazy";
    return img;
  }

  /* ============================================
     Modal
     ============================================ */
  function openModal(meme, options = {}) {
    if (!el.modal) return;
    state.currentModal = meme;

    el.modalMedia.innerHTML = "";
    el.modalMedia.appendChild(createMedia(meme, { forCard: false }));

    if (el.modalTitle) el.modalTitle.textContent = meme.title;
    if (el.modalCategory) el.modalCategory.textContent = meme.category || "uncategorized";
    if (el.modalType) el.modalType.textContent = meme.type;

    if (el.modalTags) {
      el.modalTags.innerHTML = "";
      (meme.tags || []).forEach((t) => {
        const chip = document.createElement("span");
        chip.className = "tag-chip";
        chip.textContent = t;
        el.modalTags.appendChild(chip);
      });
    }

    updateFavoriteButton(meme);
    if (el.btnDelete) el.btnDelete.hidden = !meme.uploaded;
    el.modal.hidden = false;
    document.body.style.overflow = "hidden";

    if (!options.skipUrlUpdate && IS_LIBRARY) {
      const url = new URL(window.location.href);
      url.searchParams.set("m", meme.id);
      window.history.replaceState({ memeId: meme.id }, "", url.toString());
    }
  }

  function closeModal() {
    if (!el.modal) return;
    const video = el.modalMedia.querySelector("video");
    if (video) video.pause();
    el.modal.hidden = true;
    el.modalMedia.innerHTML = "";
    state.currentModal = null;
    document.body.style.overflow = "";
    if (IS_LIBRARY) {
      const url = new URL(window.location.href);
      if (url.searchParams.has("m")) {
        url.searchParams.delete("m");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }

  function updateFavoriteButton(meme) {
    if (!el.btnFavorite) return;
    const fav = isFavorited(meme.id);
    el.btnFavorite.classList.toggle("is-favorited", fav);
    if (el.favIcon) el.favIcon.setAttribute("fill", fav ? "currentColor" : "none");
    if (el.favLabel) el.favLabel.textContent = fav ? "Saved" : "Save";
  }

  /* ============================================
     Modal actions
     ============================================ */
  async function handleDownload() {
    const m = state.currentModal;
    if (!m) return;
    try {
      const res = await fetch(m.src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const ext = m.type === "mp4" ? "mp4" : "gif";
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(m.title)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Download started");
    } catch (err) {
      showToast("Download failed");
    }
  }

  function handleFavorite() {
    const m = state.currentModal;
    if (!m) return;
    const nowFav = toggleFavorite(m.id);
    updateFavoriteButton(m);
    renderFilters();
    if (state.activeCategory === "favorites" && !nowFav) {
      setTimeout(() => renderGrid(), 200);
    } else {
      renderGrid();
    }
    showToast(nowFav ? "Saved to favorites" : "Removed from favorites");
  }

  async function handleDelete() {
    const m = state.currentModal;
    if (!m || !m.uploaded) return;
    if (!confirm(`Delete "${m.title}"? This can't be undone.`)) return;
    try {
      await dbDelete(m.id);
      URL.revokeObjectURL(m.src);
      state.uploadedMemes = state.uploadedMemes.filter((x) => x.id !== m.id);
      state.memes = [...state.uploadedMemes, ...state.jsonMemes];
      if (state.favorites.has(m.id)) {
        state.favorites.delete(m.id);
        saveFavorites();
      }
      closeModal();
      renderFilters();
      renderGrid();
      showToast("Deleted");
    } catch (err) {
      showToast("Delete failed");
    }
  }

  /* ============================================
     Share sheet
     ============================================ */
  function getShareUrl(meme) {
    // Always link to the library page so the modal opens with the meme
    const base = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/");
    return base + "memes.html?m=" + meme.id;
  }
  function getShareText(meme) {
    return `${meme.title} — on Whamr`;
  }

  const SHARE_TARGETS = [
    { name: "WhatsApp", icon: "whatsapp", build: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + " " + url)}` },
    { name: "Telegram", icon: "telegram", build: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
    { name: "X", icon: "x", build: (url, text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: "Facebook", icon: "facebook", build: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "Reddit", icon: "reddit", build: (url, text) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}` },
    { name: "LinkedIn", icon: "linkedin", build: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: "Pinterest", icon: "pinterest", build: (url, text) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}` },
    { name: "Email", icon: "email", build: (url, text) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + "\n\n" + url)}` },
  ];

  const ICON_SVGS = {
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    reddit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    native: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
  };

  function openShareSheet() {
    const m = state.currentModal;
    if (!m || !el.shareSheet) return;
    if (m.uploaded) {
      showToast("Uploaded memes stay on your device — can't be shared publicly");
      return;
    }
    const url = getShareUrl(m);
    const text = getShareText(m);
    el.shareGrid.innerHTML = "";

    if (navigator.share) {
      const btn = document.createElement("button");
      btn.className = "share-option";
      btn.innerHTML = `<div class="share-option-icon icon-native">${ICON_SVGS.native}</div><span>More...</span>`;
      btn.addEventListener("click", async () => {
        try { await navigator.share({ title: m.title, text, url }); closeShareSheet(); } catch (err) {}
      });
      el.shareGrid.appendChild(btn);
    }

    SHARE_TARGETS.forEach((t) => {
      const a = document.createElement("a");
      a.className = "share-option";
      a.href = t.build(url, text);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<div class="share-option-icon icon-${t.icon}">${ICON_SVGS[t.icon]}</div><span>${t.name}</span>`;
      a.addEventListener("click", () => setTimeout(closeShareSheet, 200));
      el.shareGrid.appendChild(a);
    });

    const copyBtn = document.createElement("button");
    copyBtn.className = "share-option";
    copyBtn.innerHTML = `<div class="share-option-icon icon-copy">${ICON_SVGS.copy}</div><span>Copy link</span>`;
    copyBtn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(url); showToast("Link copied to clipboard"); closeShareSheet(); }
      catch (err) { showToast("Could not copy"); }
    });
    el.shareGrid.appendChild(copyBtn);

    el.shareSheet.hidden = false;
  }

  function closeShareSheet() {
    if (el.shareSheet) el.shareSheet.hidden = true;
  }

  /* ============================================
     Upload (library only)
     ============================================ */
  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let added = 0;
    for (const file of files) {
      const isMp4 = file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4");
      const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
      if (!isMp4 && !isGif) continue;
      const id = "u_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      const type = isMp4 ? "mp4" : "gif";
      const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const item = { id, title, type, blob: file, category: "uploads", tags: ["uploaded"] };
      try {
        await dbAdd(item);
        state.uploadedMemes.unshift({ ...item, src: URL.createObjectURL(file), uploaded: true });
        added++;
      } catch (err) {}
    }
    state.memes = [...state.uploadedMemes, ...state.jsonMemes];
    renderFilters();
    renderGrid();
    e.target.value = "";
    if (added) showToast(`Added ${added} meme${added > 1 ? "s" : ""}`);
  }

  /* ============================================
     Deep-link
     ============================================ */
  function checkDeepLink() {
    if (!IS_LIBRARY) return;
    const url = new URL(window.location.href);
    const memeId = url.searchParams.get("m");
    if (!memeId) return;
    const meme = state.memes.find((m) => m.id === memeId);
    if (meme) {
      setTimeout(() => openModal(meme, { skipUrlUpdate: true }), 300);
    } else {
      url.searchParams.delete("m");
      window.history.replaceState({}, "", url.toString());
    }
  }

  /* ============================================
     Helpers
     ============================================ */
  function slugify(str) {
    return (str || "meme").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }

  let toastTimer;
  function showToast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 2200);
  }

  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* ============================================
     Bind events
     ============================================ */
  function bindEvents() {
    if (el.search) {
      el.search.addEventListener("input", debounce((e) => {
        state.searchQuery = e.target.value;
        renderGrid();
      }, 140));
    }
    if (el.upload) el.upload.addEventListener("change", handleUpload);
    if (el.modalClose) el.modalClose.addEventListener("click", closeModal);
    if (el.modalBackdrop) el.modalBackdrop.addEventListener("click", closeModal);
    if (el.btnShare) el.btnShare.addEventListener("click", openShareSheet);
    if (el.btnFavorite) el.btnFavorite.addEventListener("click", handleFavorite);
    if (el.btnDownload) el.btnDownload.addEventListener("click", handleDownload);
    if (el.btnDelete) el.btnDelete.addEventListener("click", handleDelete);
    if (el.shareClose) el.shareClose.addEventListener("click", closeShareSheet);
    if (el.shareBackdrop) el.shareBackdrop.addEventListener("click", closeShareSheet);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (el.shareSheet && !el.shareSheet.hidden) closeShareSheet();
        else if (el.modal && !el.modal.hidden) closeModal();
      }
    });

    window.addEventListener("popstate", () => {
      if (!IS_LIBRARY) return;
      const url = new URL(window.location.href);
      const memeId = url.searchParams.get("m");
      if (memeId) {
        const meme = state.memes.find((m) => m.id === memeId);
        if (meme) openModal(meme, { skipUrlUpdate: true });
      } else if (el.modal && !el.modal.hidden) {
        closeModal();
      }
    });
  }

  /* ============================================
     Init
     ============================================ */
  async function init() {
    loadFavorites();
    bindEvents();

    if (HAS_GRID) {
      await loadMemes();
      if (IS_LIBRARY) renderFilters();
      renderGrid();
      checkDeepLink();
    }
  }

  init();
})();
