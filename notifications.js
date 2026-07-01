/* ============================================
   notifications.js
   Shared client for Whamr notifications. Load AFTER whamr-auth.js:
     <script src="whamr-auth.js"></script>
     <script src="notifications.js"></script>

   Provides window.WhamrNotifications (a thin wrapper over /api/notifications)
   and auto-paints the unread count onto any <span class="notif-nav-badge">
   in the nav when a backend user is signed in.
   ============================================ */
(function () {
  var Auth = window.WhamrAuth;
  if (!Auth) { console.warn("notifications.js: WhamrAuth not found — load whamr-auth.js first."); return; }

  function req(path, opts) {
    return Auth.apiFetch(path, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (d) {
        if (!res.ok) { var e = new Error(d.error || ("Request failed (" + res.status + ").")); e.status = res.status; throw e; }
        return d;
      });
    });
  }

  var N = {
    list: function (type) {
      var q = type ? ("?type=" + encodeURIComponent(type)) : "";
      return req("/api/notifications" + q, { method: "GET" }).then(function (d) { return d.notifications || []; });
    },
    unreadCount: function () {
      return req("/api/notifications/unread-count", { method: "GET" }).then(function (d) { return d.count || 0; });
    },
    markRead: function (id) { return req("/api/notifications/" + id + "/read", { method: "POST" }); },
    markAllRead: function () { return req("/api/notifications/read-all", { method: "POST" }); },
    refreshBadge: refresh,
  };
  window.WhamrNotifications = N;

  function paintBadges(count) {
    var els = document.querySelectorAll(".notif-nav-badge");
    Array.prototype.forEach.call(els, function (el) {
      if (count > 0) { el.textContent = count > 99 ? "99+" : String(count); el.hidden = false; }
      else { el.hidden = true; }
    });
  }

  function refresh() {
    if (!Auth.isLoggedIn() || !Auth.isBackendUser()) { paintBadges(0); return; }
    N.unreadCount().then(paintBadges).catch(function () {});
  }

  Auth.onChange(function () { refresh(); });

  (function injectStyles() {
    if (document.getElementById("wn-styles")) return;
    var s = document.createElement("style");
    s.id = "wn-styles";
    s.textContent = ".notif-nav-badge{display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 5px;margin-left:5px;background:#ff3366;color:#fff;font-size:10px;font-weight:700;border-radius:100px;vertical-align:middle;}";
    document.head.appendChild(s);
  })();
})();
