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
  // ---- Connections ----
  // Supabase client stays for Google sign-in + favourites/comments sync.
  const SUPABASE_URL = "https://gdjjphqdphgdnbchfcuq.supabase.co";
  const SUPABASE_KEY = "sb_publishable_8C8vXot7cwmsvV3Q0vK0hg_esjjLLNy";
  const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // Backend API handles email/password auth (its own users + JWTs).
  const API_BASE =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:4000"
      : "https://whamr-be.onrender.com";
  const TOKEN_KEY = "whamr-auth-tokens";

  // Two possible identities. The backend JWT user (email/password) takes
  // precedence; the Supabase user (Google) is the fallback.
  // NOTE: favourites & comments sync use the Supabase session, so they only
  // work for Google sign-ins until those features are migrated to the backend.
  const listeners = [];
  let currentUser = null;
  let backendUser = null;
  let supabaseUser = null;

  // ---- Backend token storage (localStorage) ----
  function loadTokens() {
    try { return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null; } catch (e) { return null; }
  }
  function saveTokens(t) { try { localStorage.setItem(TOKEN_KEY, JSON.stringify(t)); } catch (e) {} }
  function clearTokens() { try { localStorage.removeItem(TOKEN_KEY); } catch (e) {} }

  // Call the backend with the access token; on 401, try one refresh then retry.
  async function apiFetch(path, options, allowRefresh) {
    if (allowRefresh === undefined) allowRefresh = true;
    options = options || {};
    const tokens = loadTokens();
    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    if (tokens && tokens.accessToken) headers["Authorization"] = "Bearer " + tokens.accessToken;
    const res = await fetch(API_BASE + path, Object.assign({}, options, { headers: headers }));
    if (res.status === 401 && allowRefresh && tokens && tokens.refreshToken) {
      const ok = await tryRefresh(tokens.refreshToken);
      if (ok) return apiFetch(path, options, false);
    }
    return res;
  }

  async function tryRefresh(refreshToken) {
    try {
      const res = await fetch(API_BASE + "/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshToken })
      });
      if (!res.ok) { clearTokens(); backendUser = null; return false; }
      const data = await res.json();
      const prev = loadTokens() || {};
      saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: prev.user });
      return true;
    } catch (e) { return false; }
  }

  function reconcile() {
    currentUser = backendUser || supabaseUser;
    listeners.forEach(function (fn) { try { fn(currentUser); } catch (e) { console.error(e); } });
    paintAuthButtons();
  }

  // ---- Email/password auth against the backend ----
  async function backendAuth(path, email, password) {
    const res = await apiFetch(path, { method: "POST", body: JSON.stringify({ email: email, password: password }) }, false);
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) {
      let msg = data.error || "Something went wrong.";
      if (Array.isArray(data.details) && data.details.length) {
        msg = data.details.map(function (d) { return d.message; }).join(" ");
      }
      throw new Error(msg);
    }
    saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
    backendUser = data.user;
    reconcile();
    return data.user;
  }

  const WhamrAuth = {
    // Shared Supabase client (favourites/comments/Google).
    db: db,
    // Backend helpers, so other code can make authenticated API calls.
    apiBase: API_BASE,
    apiFetch: apiFetch,

    getUser: function () { return currentUser; },
    isLoggedIn: function () { return !!currentUser; },
    // True when the current user is an email/password (backend JWT) account, as
    // opposed to a Google/Supabase session. Favourites & comments use this to
    // pick their storage path: backend users sync via the API, Google users via
    // the Supabase client.
    isBackendUser: function () { return !!backendUser; },
    onChange: function (fn) { listeners.push(fn); fn(currentUser); },
    openModal: function () { showModal(); },

    // Email/password -> backend.
    signup: function (email, password) { return backendAuth("/api/auth/register", email, password); },
    login: function (email, password) { return backendAuth("/api/auth/login", email, password); },

    // Request a password reset email. The backend always responds 200 with a
    // generic message (no account enumeration), so we don't reveal existence.
    forgotPassword: async function (email) {
      await fetch(API_BASE + "/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
      });
    },

    logout: async function () {
      const tokens = loadTokens();
      if (tokens && tokens.refreshToken) {
        try {
          await fetch(API_BASE + "/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: tokens.refreshToken })
          });
        } catch (e) {}
      }
      clearTokens();
      backendUser = null;
      try { await db.auth.signOut(); } catch (e) {} // also clear any Google session
      reconcile();
    },
  };

  window.WhamrAuth = WhamrAuth;

  // Supabase (Google) session changes -> fallback identity.
  db.auth.onAuthStateChange(function (event, session) {
    supabaseUser = session ? session.user : null;
    reconcile();
  });

  // Restore a backend session on load (validate the token, refreshing if needed).
  (async function restoreBackendSession() {
    const tokens = loadTokens();
    if (!tokens || !tokens.accessToken) return;
    try {
      const res = await apiFetch("/api/auth/me", { method: "GET" });
      if (res.ok) { const d = await res.json(); backendUser = d.user; }
      else { clearTokens(); backendUser = null; }
    } catch (e) {
      // Offline — trust the stored user optimistically until next call.
      backendUser = tokens.user || null;
    }
    reconcile();
  })();

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
        <button class="wam-google" id="wam-google" type="button">
          <svg class="wam-google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
        <div class="wam-divider"><span>or with email</span></div>
        <input id="wam-email" type="email" placeholder="Email" autocomplete="email" />
        <input id="wam-password" type="password" placeholder="Password (min 8 characters)" autocomplete="current-password" />
        <div class="wam-actions">
          <button class="wam-btn wam-primary" id="wam-signup">Sign Up</button>
          <button class="wam-btn wam-ghost" id="wam-login">Log In</button>
        </div>
        <button class="wam-forgot" id="wam-forgot" type="button">Forgot password?</button>
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
      if (password.length < 8) return setStatus("err", "Password must be at least 8 characters.");
      setStatus("load", "Creating your account...");
      try {
        await WhamrAuth.signup(email, password);
        setStatus("ok", "Account created! Setting things up…");
        // New accounts go through the welcome/onboarding flow.
        setTimeout(function () { window.location.href = "onboarding.html"; }, 700);
      } catch (e) {
        setStatus("err", e.message || "Sign up failed.");
      }
    });

    overlay.querySelector("#wam-login").addEventListener("click", async function () {
      const { email, password } = getCreds();
      if (!email || !password) return setStatus("err", "Enter an email and password.");
      setStatus("load", "Logging in...");
      try {
        await WhamrAuth.login(email, password);
        setStatus("ok", "Welcome back!");
        setTimeout(close, 700);
      } catch (e) {
        setStatus("err", e.message || "Login failed.");
      }
    });

    overlay.querySelector("#wam-forgot").addEventListener("click", async function () {
      const { email } = getCreds();
      if (!email) return setStatus("err", "Enter your email above, then tap “Forgot password?”.");
      if (!/.+@.+\..+/.test(email)) return setStatus("err", "Enter a valid email address.");
      setStatus("load", "Sending reset link...");
      try {
        await WhamrAuth.forgotPassword(email);
        setStatus("ok", "If that email is registered, a reset link is on its way.");
      } catch (e) {
        setStatus("err", "Couldn't send the reset link. Try again.");
      }
    });

    overlay.querySelector("#wam-google").addEventListener("click", async function () {
      setStatus("load", "Opening Google sign-in...");
      try {
        const { error } = await db.auth.signInWithOAuth({
          provider: "google",
          options: {
            // After Google redirects back, land on the page the user was on.
            redirectTo: window.location.href
          }
        });
        if (error) return setStatus("err", error.message);
        // On success, the browser is redirected to Google. No further code runs here.
      } catch (e) {
        setStatus("err", (e && e.message) || "Google sign-in failed. Try again.");
      }
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
      #whamr-auth-modal .wam-forgot { display: block; width: 100%; margin: 12px 0 0; padding: 4px; background: none; border: none; color: #8a8a96; font-size: 12.5px; font-family: inherit; text-align: center; cursor: pointer; }
      #whamr-auth-modal .wam-forgot:hover { color: #ff3366; text-decoration: underline; }
      #whamr-auth-modal .wam-google {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        width: 100%; padding: 11px 14px;
        background: #fff; color: #1f1f1f;
        border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
        font-size: 14px; font-weight: 600; font-family: inherit;
        cursor: pointer; margin-bottom: 12px;
        transition: filter 0.15s;
      }
      #whamr-auth-modal .wam-google:hover { filter: brightness(0.95); }
      #whamr-auth-modal .wam-google:disabled { opacity: 0.6; cursor: not-allowed; }
      #whamr-auth-modal .wam-google-icon { flex-shrink: 0; }
      #whamr-auth-modal .wam-divider {
        display: flex; align-items: center; gap: 10px;
        font-size: 11.5px; color: #8a8a96;
        text-transform: uppercase; letter-spacing: 0.1em;
        margin: 2px 0 12px;
      }
      #whamr-auth-modal .wam-divider::before,
      #whamr-auth-modal .wam-divider::after {
        content: ""; flex: 1; height: 1px;
        background: rgba(255,255,255,0.08);
      }
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

      /* Minimal Pack CSS: the "Add to pack" button in the meme modal and the
         pack count badge in the nav. Everything else (modal, cards) moved to pack.html. */
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
    `;
    document.head.appendChild(s);
  }
})();
