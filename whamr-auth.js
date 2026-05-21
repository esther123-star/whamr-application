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
    `;
    document.head.appendChild(s);
  }
})();
