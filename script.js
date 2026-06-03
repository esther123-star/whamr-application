/* ============================================
   whamr-auth.js
   Shared Supabase auth for the whole Whamr site.
   Load this on every page (before script.js) like:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="whamr-auth.js"></script>

   It gives the rest of the site a simple, consistent way to know
   who is logged in, and provides a login/signup modal.
   ============================================ */

(function () {
  // ---- Connection (same project you've been testing) ----
  const SUPABASE_URL = "https://gdjjphqdphgdnbchfcuq.supabase.co";
  const SUPABASE_KEY = "sb_publishable_8C8vXot7cwmsvV3Q0vK0hg_esjjLLNy";

  // Create one shared client for the whole site
  const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // We expose a small, friendly toolkit on window.WhamrAuth so any page
  // (and script.js) can use it without knowing Supabase details.
  const listeners = [];
  let currentUser = null;

  const WhamrAuth = {
    // The shared database client, so other code can read/write data
    db: db,

    // Who's logged in right now? Returns the user object or null.
    getUser: function () {
      return currentUser;
    },

    // Are we logged in?
    isLoggedIn: function () {
      return !!currentUser;
    },

    // Register a function to run whenever login state changes.
    // Used by script.js to re-sync favourites on login/logout.
    onChange: function (fn) {
      listeners.push(fn);
      // call immediately with the current state
      fn(currentUser);
    },

    // Open the login/signup modal
    openModal: function () {
      showModal();
    },

    // Log out
    logout: async function () {
      await db.auth.signOut();
    },
  };

  window.WhamrAuth = WhamrAuth;

  // ---- React to auth changes from Supabase ----
  db.auth.onAuthStateChange(function (event, session) {
    currentUser = session ? session.user : null;
    // tell everyone who registered
    listeners.forEach(function (fn) {
      try { fn(currentUser); } catch (e) { console.error(e); }
    });
    // update any auth buttons on the page
    paintAuthButtons();
  });

  /* ============================================
     The login / signup modal
     ============================================ */
  function showModal() {
    if (document.getElementById("whamr-auth-modal")) return; // already open

    const overlay = document.createElement("div");
    overlay.id = "whamr-auth-modal";
    overlay.innerHTML = `
      <div class="wam-backdrop"></div>
      <div class="wam-card">
        <button class="wam-close" aria-label="Close">&times;</button>
        <h2 class="wam-title">Welcome to Whamr</h2>
        <p class="wam-sub">Sign in to save your favourites across devices.</p>
        <div class="wam-status" id="wam-status"></div>
        <input id="wam-email" type="email" placeholder="Email" autocomplete="email" />
        <input id="wam-password" type="password" placeholder="Password (min 6 characters)" autocomplete="current-password" />
        <div class="wam-actions">
          <button class="wam-btn wam-primary" id="wam-signup">Sign Up</button>
          <button class="wam-btn wam-ghost" id="wam-login">Log In</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    injectStyles();

    const close = function () { overlay.remove(); };
    overlay.querySelector(".wam-backdrop").addEventListener("click", close);
    overlay.querySelector(".wam-close").addEventListener("click", close);

    const statusEl = overlay.querySelector("#wam-status");
    const setStatus = function (kind, msg) {
      statusEl.className = "wam-status " + kind;
      statusEl.textContent = msg;
    };

    const getCreds = function () {
      return {
        email: overlay.querySelector("#wam-email").value.trim(),
        password: overlay.querySelector("#wam-password").value,
      };
    };

    overlay.querySelector("#wam-signup").addEventListener("click", async function () {
      const { email, password } = getCreds();
      if (!email || !password) return setStatus("err", "Enter an email and password.");
      setStatus("load", "Creating your account...");
      const { error } = await db.auth.signUp({ email: email, password: password });
      if (error) return setStatus("err", error.message);
      setStatus("ok", "Account created. You're in!");
      setTimeout(close, 900);
    });

    overlay.querySelector("#wam-login").addEventListener("click", async function () {
      const { email, password } = getCreds();
      if (!email || !password) return setStatus("err", "Enter an email and password.");
      setStatus("load", "Logging in...");
      const { error } = await db.auth.signInWithPassword({ email: email, password: password });
      if (error) return setStatus("err", error.message);
      setStatus("ok", "Welcome back!");
      setTimeout(close, 700);
    });
  }

  /* ============================================
     Auth buttons in the nav
     Any element with id="whamr-auth-area" gets filled automatically.
     ============================================ */
  function paintAuthButtons() {
    const areas = document.querySelectorAll("#whamr-auth-area");
    areas.forEach(function (area) {
      if (currentUser) {
        const name = currentUser.email ? currentUser.email.split("@")[0] : "you";
        area.innerHTML =
          '<span class="wam-greeting">Hi, ' + escapeHtml(name) + '</span>' +
          '<button class="wam-navbtn" id="wam-logout-btn">Log out</button>';
        const btn = area.querySelector("#wam-logout-btn");
        if (btn) btn.addEventListener("click", function () { WhamrAuth.logout(); });
      } else {
        area.innerHTML =
          '<button class="wam-navbtn wam-navbtn-primary" id="wam-open-btn">Sign In</button>';
        const btn = area.querySelector("#wam-open-btn");
        if (btn) btn.addEventListener("click", function () { WhamrAuth.openModal(); });
      }
    });
  }

  // Paint buttons once the page is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paintAuthButtons);
  } else {
    paintAuthButtons();
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ============================================
     Modal + button styles (matches Whamr dark theme)
     ============================================ */
  function injectStyles() {
    if (document.getElementById("wam-styles")) return;
    const s = document.createElement("style");
    s.id = "wam-styles";
    s.textContent = `
      #whamr-auth-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
      #whamr-auth-modal .wam-backdrop { position: absolute; inset: 0; background: rgba(5,5,10,0.8); backdrop-filter: blur(8px); }
      #whamr-auth-modal .wam-card { position: relative; background: #14141c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 28px 24px; width: 100%; max-width: 360px; box-shadow: 0 24px 80px rgba(0,0,0,0.6); }
      #whamr-auth-modal .wam-close { position: absolute; top: 14px; right: 16px; background: none; border: none; color: #8a8a96; font-size: 24px; cursor: pointer; line-height: 1; }
      #whamr-auth-modal .wam-title { font-family: 'Poppins', system-ui, sans-serif; font-size: 22px; font-weight: 700; color: #f5f5f7; margin: 0 0 4px; }
      #whamr-auth-modal .wam-sub { font-size: 13.5px; color: #8a8a96; margin: 0 0 18px; }
      #whamr-auth-modal input { width: 100%; padding: 12px 14px; background: #0a0a0f; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #f5f5f7; font-size: 15px; font-family: inherit; margin-bottom: 10px; box-sizing: border-box; }
      #whamr-auth-modal input:focus { outline: none; border-color: #ff3366; }
      #whamr-auth-modal .wam-actions { display: flex; gap: 8px; margin-top: 4px; }
      #whamr-auth-modal .wam-btn { flex: 1; padding: 12px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
      #whamr-auth-modal .wam-primary { background: #ff3366; color: #fff; }
      #whamr-auth-modal .wam-ghost { background: #232330; color: #f5f5f7; }
      #whamr-auth-modal .wam-status { font-size: 13px; padding: 0; margin: 0 0 10px; min-height: 0; }
      #whamr-auth-modal .wam-status.err { color: #ef4444; }
      #whamr-auth-modal .wam-status.ok { color: #4ade80; }
      #whamr-auth-modal .wam-status.load { color: #8a8a96; }
      #whamr-auth-area { display: inline-flex; align-items: center; gap: 12px; }
      .wam-greeting { font-size: 14px; color: #8a8a96; white-space: nowrap; }
      .wam-navbtn { padding: 9px 18px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.12); background: #14141c; color: #f5f5f7; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; }
      .wam-navbtn-primary { background: #ff3366; border-color: #ff3366; color: #fff; }

      /* Public comment system styles */
      .discuss-actions { display: flex; gap: 8px; margin-top: 8px; }
      .discuss-act { background: none; border: 1px solid rgba(255,255,255,0.15); color: #8a8a96; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px; cursor: pointer; font-family: inherit; }
      .discuss-act:hover { color: #f5f5f7; border-color: rgba(255,255,255,0.3); }
      .discuss-del:hover { color: #ef4444; border-color: #ef4444; }
      .discuss-report:hover { color: #ffe34d; border-color: #ffe34d; }
      .discuss-you { font-size: 10px; font-weight: 700; color: #ff3366; background: rgba(255,51,102,0.12); padding: 1px 7px; border-radius: 100px; margin-left: 6px; }
      .discuss-reported { font-size: 10px; font-weight: 700; color: #ffe34d; background: rgba(255,227,77,0.12); padding: 1px 7px; border-radius: 100px; margin-left: 6px; }
      .discuss-login-prompt a { color: #ff3366; text-decoration: none; font-weight: 600; }

      /* ============================================
         Pagination control for the memes page
         ============================================ */
      .pagination {
        display: flex; flex-wrap: wrap; justify-content: center;
        align-items: center; gap: 6px;
        padding: 40px 16px 60px;
        max-width: 760px; margin: 24px auto 0;
      }
      .pg-btn {
        display: inline-flex; align-items: center; gap: 6px;
        min-width: 38px; height: 38px; padding: 0 12px;
        background: #14141c; border: 1px solid rgba(255,255,255,0.1);
        color: #f5f5f7; font-family: inherit; font-size: 13px; font-weight: 600;
        border-radius: 10px; cursor: pointer;
        transition: background 0.12s, border-color 0.12s, color 0.12s, transform 0.1s;
      }
      .pg-btn:hover:not(:disabled):not(.is-active) {
        background: #1c1c26; border-color: rgba(255,255,255,0.2);
      }
      .pg-btn:active:not(:disabled) { transform: scale(0.96); }
      .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      .pg-btn.is-active {
        background: #ff3366; border-color: #ff3366; color: #fff;
        cursor: default;
      }
      .pg-num { justify-content: center; padding: 0 10px; }
      .pg-prev, .pg-next { padding: 0 14px; }
      .pg-ellipsis {
        color: #6a6a78; padding: 0 4px; font-weight: 600; user-select: none;
      }
      @media (max-width: 640px) {
        .pagination { gap: 4px; padding: 28px 12px 48px; }
        .pg-btn { min-width: 34px; height: 34px; font-size: 12.5px; padding: 0 9px; }
        .pg-prev span, .pg-next span { display: none; }
        .pg-prev, .pg-next { padding: 0 10px; }
      }

      /* ============================================
         Sticker Pack Builder \u2014 Phase 1
         ============================================ */
      .pack-count-badge {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 18px; height: 18px; padding: 0 5px;
        background: #ff3366; color: #fff;
        font-size: 10px; font-weight: 700;
        border-radius: 100px; margin-left: 4px;
      }
      #btn-pack.is-active {
        background: rgba(255, 51, 102, 0.18) !important;
        color: #ff3366 !important;
        border-color: #ff3366 !important;
      }
      .pack-modal {
        position: fixed; inset: 0; z-index: 1000;
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
      }
      .pack-backdrop {
        position: absolute; inset: 0;
        background: rgba(5,5,10,0.8); backdrop-filter: blur(6px);
      }
      .pack-content {
        position: relative; z-index: 1;
        width: 100%; max-width: 720px; max-height: calc(100vh - 40px);
        background: #14141c; border: 1px solid rgba(255,255,255,0.1);
        border-radius: 18px; padding: 24px 24px 20px;
        overflow-y: auto;
        overflow-x: hidden;
        box-shadow: 0 24px 60px rgba(0,0,0,0.6);
        display: flex; flex-direction: column;
      }
      .pack-close {
        position: absolute; top: 14px; right: 14px;
        background: rgba(255,255,255,0.06); border: none;
        color: #8a8a96; width: 32px; height: 32px;
        border-radius: 50%; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
      }
      .pack-close:hover { background: rgba(255,255,255,0.12); color: #f5f5f7; }
      .pack-head { margin-bottom: 18px; padding-right: 36px; }
      .pack-title {
        font-family: 'Poppins', sans-serif;
        font-size: 22px; font-weight: 700; color: #f5f5f7;
        margin: 0 0 4px; letter-spacing: -0.02em;
      }
      .pack-sub { font-size: 13.5px; color: #8a8a96; margin: 0; }
      .pack-meta {
        display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        margin-bottom: 16px;
      }
      .pack-field { display: flex; flex-direction: column; gap: 5px; }
      .pack-field-label {
        font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
        text-transform: uppercase; color: #8a8a96;
      }
      .pack-field input {
        padding: 10px 12px; background: #0a0a0f;
        border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
        color: #f5f5f7; font-size: 14px; font-family: inherit;
      }
      .pack-field input:focus {
        outline: none; border-color: #ff3366;
      }
      .pack-status {
        display: flex; align-items: center; justify-content: space-between;
        gap: 12px; flex-wrap: wrap;
        padding: 10px 14px; margin-bottom: 14px;
        background: rgba(255,51,102,0.08);
        border: 1px solid rgba(255,51,102,0.18);
        border-radius: 10px;
      }
      .pack-count-line { font-size: 14px; color: #c8c8d2; }
      .pack-count-line strong { color: #ff3366; font-weight: 700; font-size: 15px; }
      .pack-min { color: #8a8a96; font-size: 12.5px; margin-left: 4px; }
      .pack-types-line { display: flex; gap: 6px; }
      .pack-pill {
        font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em;
        text-transform: uppercase;
        background: rgba(255,255,255,0.06); color: #c8c8d2;
        padding: 3px 9px; border-radius: 100px;
      }
      .pack-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
        margin-bottom: 16px;
        min-width: 0; /* allow grid items to shrink properly */
      }
      .pack-card {
        position: relative;
        background: #0a0a0f; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px; overflow: hidden;
        padding: 8px;
      }
      .pack-card-media {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1 !important;
        object-fit: cover;
        border-radius: 6px;
        background: #14141c;
        box-sizing: border-box;
      }
      /* Container also locks down, in case any inherited style tries to push children out */
      .pack-card {
        contain: layout paint;
        overflow: hidden;
      }
      /* Static-icon tile for animated items (no <video> element) */
      .pack-card-media-anim {
        display: flex !important;
        align-items: center;
        justify-content: center;
        color: #ff3366;
        background: linear-gradient(135deg, #1a1424, #14141c);
        border: 1px solid rgba(255, 51, 102, 0.25);
      }
      .pack-card-media-anim svg {
        opacity: 0.85;
      }
      .pack-card-title {
        font-size: 11.5px; color: #c8c8d2;
        margin-top: 6px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .pack-card-tag {
        position: absolute; top: 11px; left: 11px;
        font-size: 9px; font-weight: 700; letter-spacing: 0.06em;
        background: rgba(0,0,0,0.6); color: #fff;
        padding: 2px 6px; border-radius: 4px;
      }
      .pack-card-tag-animated { background: #ff3366; }
      .pack-card-remove {
        position: absolute; top: 6px; right: 6px;
        width: 22px; height: 22px; border-radius: 50%;
        background: rgba(0,0,0,0.7); color: #fff;
        border: none; cursor: pointer;
        font-size: 14px; line-height: 1;
        display: flex; align-items: center; justify-content: center;
      }
      .pack-card-remove:hover { background: #ff3366; }
      .pack-card-missing .pack-card-media {
        display: flex; align-items: center; justify-content: center;
        color: #6a6a78; font-size: 24px;
      }
      .pack-empty {
        text-align: center; padding: 28px 16px;
        color: #8a8a96; font-size: 14px;
      }
      .pack-empty-icon { font-size: 36px; margin-bottom: 8px; }
      .pack-empty p { margin: 0; line-height: 1.5; }
      .pack-empty strong { color: #f5f5f7; }
      .pack-foot {
        display: flex; gap: 10px; justify-content: flex-end;
        padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06);
        margin-top: auto;
      }
      .pack-btn {
        padding: 10px 18px; border: none; border-radius: 100px;
        font-family: inherit; font-size: 13.5px; font-weight: 600;
        cursor: pointer;
      }
      .pack-btn-ghost {
        background: rgba(255,255,255,0.06); color: #c8c8d2;
      }
      .pack-btn-ghost:hover { background: rgba(255,255,255,0.1); color: #f5f5f7; }
      .pack-btn-primary {
        background: #ff3366; color: #fff;
      }
      .pack-btn-primary:disabled {
        opacity: 0.5; cursor: not-allowed;
      }
      .pack-soon {
        font-size: 11px; font-weight: 500;
        opacity: 0.85; margin-left: 4px;
      }
      @media (max-width: 640px) {
        .pack-content { padding: 20px 16px 18px; max-height: calc(100vh - 24px); }
        .pack-meta { grid-template-columns: 1fr; gap: 10px; }
        .pack-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
        .pack-title { font-size: 19px; }
      }
    `;
    document.head.appendChild(s);
  }
})();
