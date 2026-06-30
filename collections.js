/* ============================================
   collections.js
   Shared client for Whamr "collections" (named, optionally-public lists of
   memes — like playlists). Load AFTER whamr-auth.js:
     <script src="whamr-auth.js"></script>
     <script src="collections.js"></script>

   Provides:
     window.WhamrCollections — a thin wrapper over the backend
       /api/collections endpoints (uses WhamrAuth.apiFetch, so it carries the
       backend JWT and auto-refreshes), plus shared helpers (catalog lookup,
       thumbnail element, toast).
     An "Add to a collection" dialog wired to any #btn-collect on the page
       (the meme modal on memes.html).

   Collections require a backend (email/password) account, the same identity
   that favourites sync uses — a Google-only session has no backend JWT, so it
   is asked to use an email account.
   ============================================ */
(function () {
  var Auth = window.WhamrAuth;
  if (!Auth) { console.warn("collections.js: WhamrAuth not found — load whamr-auth.js first."); return; }

  /* ---- Tiny toast (independent of script.js) ---- */
  var _toastTimer = null;
  function toast(msg) {
    var t = document.getElementById("wc-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "wc-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    if (_toastTimer) clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  /* ---- Meme catalog (id -> meme) for rendering thumbnails ---- */
  var _catalog = null;
  function loadCatalog() {
    if (_catalog) return Promise.resolve(_catalog);
    return fetch("data/memes.json", { cache: "force-cache" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (arr) {
        _catalog = new Map();
        (arr || []).forEach(function (m) { _catalog.set(m.id, m); });
        return _catalog;
      })
      .catch(function () { _catalog = new Map(); return _catalog; });
  }
  function memeById(id) { return _catalog ? _catalog.get(id) || null : null; }

  /** Build a thumbnail element for a meme (or a placeholder if unknown). */
  function thumbEl(meme) {
    if (!meme) {
      var d = document.createElement("div");
      d.className = "wc-thumb wc-thumb-empty";
      return d;
    }
    if (meme.type === "mp4") {
      var v = document.createElement("video");
      v.className = "wc-thumb";
      v.muted = true; v.playsInline = true; v.preload = "metadata";
      // #t=0.1 nudges the browser to paint an early frame as a poster.
      v.src = meme.src + "#t=0.1";
      return v;
    }
    var img = document.createElement("img");
    img.className = "wc-thumb";
    img.loading = "lazy"; img.alt = meme.title || "meme";
    img.src = meme.src;
    return img;
  }

  /* ---- API wrapper over /api/collections ---- */
  function req(path, opts) {
    return Auth.apiFetch(path, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error(data.error || ("Request failed (" + res.status + ")."));
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  var Collections = {
    list: function () { return req("/api/collections", { method: "GET" }).then(function (d) { return d.collections || []; }); },
    create: function (body) { return req("/api/collections", { method: "POST", body: JSON.stringify(body) }).then(function (d) { return d.collection; }); },
    get: function (id) { return req("/api/collections/" + id, { method: "GET" }).then(function (d) { return d.collection; }); },
    update: function (id, patch) { return req("/api/collections/" + id, { method: "PATCH", body: JSON.stringify(patch) }).then(function (d) { return d.collection; }); },
    remove: function (id) { return req("/api/collections/" + id, { method: "DELETE" }); },
    addItem: function (id, memeId) { return req("/api/collections/" + id + "/items", { method: "POST", body: JSON.stringify({ meme_id: memeId }) }); },
    removeItem: function (id, memeId) { return req("/api/collections/" + id + "/items/" + encodeURIComponent(memeId), { method: "DELETE" }); },

    // Shared helpers (used by collections.html too).
    loadCatalog: loadCatalog,
    memeById: memeById,
    thumbEl: thumbEl,
    toast: toast,

    /**
     * Gate an action behind a backend account. Returns true if good to go;
     * otherwise opens the auth modal (signed out) or toasts (Google-only) and
     * returns false.
     */
    requireBackendUser: function () {
      if (!Auth.isLoggedIn()) { Auth.openModal(); return false; }
      if (!Auth.isBackendUser()) { toast("Collections need an email account right now."); return false; }
      return true;
    },
  };
  window.WhamrCollections = Collections;

  /* ============================================
     "Add to a collection" dialog (meme modal)
     ============================================ */
  function openAddDialog(meme) {
    if (document.getElementById("wc-add-modal")) return;

    var overlay = document.createElement("div");
    overlay.id = "wc-add-modal";
    overlay.innerHTML =
      '<div class="wc-backdrop"></div>' +
      '<div class="wc-card" role="dialog" aria-modal="true" aria-label="Add to a collection">' +
        '<button class="wc-close" aria-label="Close">&times;</button>' +
        '<h3 class="wc-title">Add to a collection</h3>' +
        '<p class="wc-sub"></p>' +
        '<div class="wc-list" id="wc-list"><div class="wc-muted">Loading your collections…</div></div>' +
        '<form class="wc-new" id="wc-new">' +
          '<input id="wc-new-name" class="wc-input" type="text" placeholder="New collection name…" maxlength="80" autocomplete="off" />' +
          '<button class="wc-btn wc-primary" type="submit">Create</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.querySelector(".wc-sub").textContent = meme.title || "";

    var close = function () { overlay.remove(); };
    overlay.querySelector(".wc-backdrop").addEventListener("click", close);
    overlay.querySelector(".wc-close").addEventListener("click", close);
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });

    var listEl = overlay.querySelector("#wc-list");

    function rowFor(c) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "wc-row";
      row.innerHTML =
        '<span class="wc-row-name"></span>' +
        '<span class="wc-row-meta">' + (c.item_count || 0) + (c.is_public ? " · public" : "") + '</span>' +
        '<span class="wc-row-add">Add</span>';
      row.querySelector(".wc-row-name").textContent = c.name;
      row.addEventListener("click", function () {
        if (row.classList.contains("is-added") || row.classList.contains("is-busy")) return;
        row.classList.add("is-busy");
        Collections.addItem(c.id, meme.id).then(function () {
          row.classList.remove("is-busy");
          row.classList.add("is-added");
          row.querySelector(".wc-row-add").textContent = "Added ✓";
          toast('Added to "' + c.name + '"');
        }).catch(function (err) {
          row.classList.remove("is-busy");
          if (err.status === 409) {
            row.classList.add("is-added");
            row.querySelector(".wc-row-add").textContent = "Already in ✓";
            toast('Already in "' + c.name + '"');
          } else {
            toast(err.message || "Could not add to collection.");
          }
        });
      });
      return row;
    }

    Collections.list().then(function (cols) {
      listEl.innerHTML = "";
      if (!cols.length) {
        listEl.innerHTML = '<div class="wc-muted">No collections yet — create one below.</div>';
        return;
      }
      cols.forEach(function (c) { listEl.appendChild(rowFor(c)); });
    }).catch(function (err) {
      listEl.innerHTML = '<div class="wc-muted">' + (err.message || "Could not load collections.") + "</div>";
    });

    overlay.querySelector("#wc-new").addEventListener("submit", function (e) {
      e.preventDefault();
      var input = overlay.querySelector("#wc-new-name");
      var name = input.value.trim();
      if (!name) return;
      input.disabled = true;
      Collections.create({ name: name }).then(function (c) {
        return Collections.addItem(c.id, meme.id).then(function () { return c; });
      }).then(function (c) {
        input.disabled = false; input.value = "";
        var empty = listEl.querySelector(".wc-muted");
        if (empty) listEl.innerHTML = "";
        var row = rowFor({ id: c.id, name: c.name, item_count: 1, is_public: c.is_public });
        row.classList.add("is-added");
        row.querySelector(".wc-row-add").textContent = "Added ✓";
        listEl.insertBefore(row, listEl.firstChild);
        toast('Created "' + c.name + '" and added this meme');
      }).catch(function (err) {
        input.disabled = false;
        toast(err.message || "Could not create collection.");
      });
    });
  }

  // Wire any #btn-collect on the page (the meme modal action on memes.html).
  function wireCollectButton() {
    var btn = document.getElementById("btn-collect");
    if (!btn || btn._wcWired) return;
    btn._wcWired = true;
    btn.addEventListener("click", function () {
      var meme = window.WhamrModalMeme;
      if (!meme) return;
      if (!Collections.requireBackendUser()) return;
      openAddDialog(meme);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireCollectButton);
  } else {
    wireCollectButton();
  }

  /* ---- Styles (dark theme, matches the auth modal) ---- */
  (function injectStyles() {
    if (document.getElementById("wc-styles")) return;
    var s = document.createElement("style");
    s.id = "wc-styles";
    s.textContent = [
      "#wc-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);z-index:1200;",
        "background:#14141c;border:1px solid rgba(255,255,255,0.14);color:#f5f5f7;font-family:'Poppins',system-ui,sans-serif;",
        "font-size:13.5px;font-weight:600;padding:11px 18px;border-radius:100px;box-shadow:0 12px 40px rgba(0,0,0,0.5);",
        "opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;max-width:88vw;text-align:center;}",
      "#wc-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}",
      "#wc-add-modal{position:fixed;inset:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Poppins',system-ui,sans-serif;}",
      "#wc-add-modal .wc-backdrop{position:absolute;inset:0;background:rgba(5,5,10,0.8);backdrop-filter:blur(8px);}",
      "#wc-add-modal .wc-card{position:relative;background:#14141c;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px 22px;width:100%;max-width:380px;box-shadow:0 24px 80px rgba(0,0,0,0.6);}",
      "#wc-add-modal .wc-close{position:absolute;top:12px;right:14px;background:none;border:none;color:#8a8a96;font-size:24px;cursor:pointer;line-height:1;}",
      "#wc-add-modal .wc-title{font-size:19px;font-weight:700;color:#f5f5f7;margin:0 0 2px;}",
      "#wc-add-modal .wc-sub{font-size:12.5px;color:#8a8a96;margin:0 0 16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      "#wc-add-modal .wc-list{display:flex;flex-direction:column;gap:8px;max-height:46vh;overflow-y:auto;margin-bottom:14px;}",
      "#wc-add-modal .wc-muted{font-size:13px;color:#8a8a96;padding:10px 2px;}",
      "#wc-add-modal .wc-row{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:#0f0f16;border:1px solid rgba(255,255,255,0.08);",
        "border-radius:10px;padding:11px 14px;cursor:pointer;font-family:inherit;transition:border-color .12s,background .12s;}",
      "#wc-add-modal .wc-row:hover{border-color:rgba(255,255,255,0.2);background:#15151f;}",
      "#wc-add-modal .wc-row-name{flex:1;font-size:14px;font-weight:600;color:#f5f5f7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      "#wc-add-modal .wc-row-meta{font-size:11px;color:#6a6a78;white-space:nowrap;}",
      "#wc-add-modal .wc-row-add{font-size:12px;font-weight:700;color:#ff3366;white-space:nowrap;}",
      "#wc-add-modal .wc-row.is-added{opacity:0.75;cursor:default;}",
      "#wc-add-modal .wc-row.is-added .wc-row-add{color:#4ade80;}",
      "#wc-add-modal .wc-row.is-busy{opacity:0.6;cursor:wait;}",
      "#wc-add-modal .wc-new{display:flex;gap:8px;border-top:1px solid rgba(255,255,255,0.08);padding-top:14px;}",
      "#wc-add-modal .wc-input{flex:1;padding:11px 13px;background:#0a0a0f;border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#f5f5f7;font-size:14px;font-family:inherit;}",
      "#wc-add-modal .wc-input:focus{outline:none;border-color:#ff3366;}",
      "#wc-add-modal .wc-btn{padding:11px 16px;border:none;border-radius:8px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit;}",
      "#wc-add-modal .wc-primary{background:#ff3366;color:#fff;}",
      "#wc-add-modal .wc-primary:disabled{opacity:0.6;cursor:wait;}",
      ".wc-thumb{width:100%;height:100%;object-fit:cover;display:block;background:#0a0a0f;}",
      ".wc-thumb-empty{background:linear-gradient(135deg,#1a1a24,#0f0f16);}"
    ].join("");
    document.head.appendChild(s);
  })();
})();
