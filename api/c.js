/* Vercel serverless function — public meme share page at /c/:id
 *
 * vercel.json rewrites /c/:id -> /api/c?id=:id. This renders a full HTML
 * document with PER-MEME Open Graph / Twitter meta tags injected server-side,
 * so the link unfurls with the actual meme when shared to WhatsApp / X / etc.
 * (crawlers don't run JS, so the tags must be in the initial response).
 *
 * The visible page (dark theme, /style.css) shows the meme, share buttons, a
 * read-only comments preview (fetched client-side from the public comments API),
 * and a CTA back into the app.
 */

// Bundle the catalog with the function when possible; fall back to a runtime
// fetch from the same deployment if the bundler didn't include it.
let CATALOG = null;
try { CATALOG = require('../data/memes.json'); } catch (e) { CATALOG = null; }

let MEME_MAP = null;
async function getMap(host) {
  if (MEME_MAP) return MEME_MAP;
  let arr = CATALOG;
  if (!arr) {
    try {
      const r = await fetch('https://' + host + '/data/memes.json');
      arr = r.ok ? await r.json() : [];
    } catch (e) { arr = []; }
  }
  MEME_MAP = new Map((arr || []).map(function (m) { return [m.id, m]; }));
  return MEME_MAP;
}

const IMAGE_TYPES = { webp: 1, png: 1, jpg: 1, jpeg: 1, gif: 1 };

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getId(req) {
  if (req.query && req.query.id) {
    return Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  }
  try {
    const u = new URL(req.url, 'http://x');
    const q = u.searchParams.get('id');
    if (q) return q;
    const m = u.pathname.match(/\/c\/([^/?#]+)/);
    if (m) return decodeURIComponent(m[1]);
  } catch (e) {}
  return null;
}

function notFoundHtml(canonicalBase) {
  return page({
    title: 'Meme not found · Whamr',
    description: "This meme link is broken or the meme has moved. Find another on Whamr.",
    canonical: canonicalBase + '/c/',
    ogImage: '',
    ogVideo: '',
    bodyTitle: 'This meme no dey 🤷🏾‍♂️',
    bodySub: "The link is broken or the meme has moved. Plenty more where that came from.",
    mediaHtml: '',
    memeId: '',
    category: '',
    tags: [],
    notFound: true,
  });
}

function page(o) {
  const ogType = o.ogVideo ? 'video.other' : 'website';
  const twitterCard = o.ogImage ? 'summary_large_image' : (o.ogVideo ? 'player' : 'summary');
  const metaImage = o.ogImage
    ? '<meta property="og:image" content="' + esc(o.ogImage) + '" />\n' +
      '  <meta name="twitter:image" content="' + esc(o.ogImage) + '" />'
    : '';
  const metaVideo = o.ogVideo
    ? '<meta property="og:video" content="' + esc(o.ogVideo) + '" />\n' +
      '  <meta property="og:video:secure_url" content="' + esc(o.ogVideo) + '" />\n' +
      '  <meta property="og:video:type" content="video/mp4" />'
    : '';

  const tagsHtml = (o.tags || []).slice(0, 8).map(function (t) {
    return '<span class="sl-tag">' + esc(t) + '</span>';
  }).join('');

  const shareBlock = o.notFound ? '' : (
    '<div class="sl-share" id="sl-share"></div>' +
    '<div class="sl-section"><h2 class="sl-h2">Discussion</h2>' +
      '<div class="sl-comments" id="sl-comments"><p class="sl-muted">Loading comments…</p></div>' +
      '<a class="sl-link" href="/memes.html?m=' + esc(o.memeId) + '">Join the discussion →</a>' +
    '</div>'
  );

  return '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'  <meta charset="UTF-8" />\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
'  <title>' + esc(o.title) + '</title>\n' +
'  <meta name="description" content="' + esc(o.description) + '" />\n' +
'  <meta name="theme-color" content="#0a0a0f" />\n' +
'  <link rel="canonical" href="' + esc(o.canonical) + '" />\n' +
'  <meta property="og:site_name" content="Whamr" />\n' +
'  <meta property="og:type" content="' + ogType + '" />\n' +
'  <meta property="og:title" content="' + esc(o.title) + '" />\n' +
'  <meta property="og:description" content="' + esc(o.description) + '" />\n' +
'  <meta property="og:url" content="' + esc(o.canonical) + '" />\n' +
'  ' + metaImage + '\n' +
'  ' + metaVideo + '\n' +
'  <meta name="twitter:card" content="' + twitterCard + '" />\n' +
'  <meta name="twitter:title" content="' + esc(o.title) + '" />\n' +
'  <meta name="twitter:description" content="' + esc(o.description) + '" />\n' +
'  <link rel="preconnect" href="https://fonts.googleapis.com" />\n' +
'  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
'  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />\n' +
'  <link rel="stylesheet" href="/style.css" />\n' +
'  <style>\n' + PAGE_CSS + '\n  </style>\n' +
'</head>\n' +
'<body>\n' +
'  <nav class="page-nav">\n' +
'    <a href="/" class="page-nav-back"><span>← Home</span></a>\n' +
'    <a href="/" class="page-nav-brand"><div class="logo">whamr<span class="logo-dot">.</span></div></a>\n' +
'    <div class="page-nav-links"><a href="/memes.html" class="hero-nav-link">All memes</a></div>\n' +
'  </nav>\n' +
'  <main class="sl-wrap">\n' +
'    <div class="sl-card">\n' +
'      <div class="sl-media">' + (o.mediaHtml || '') + '</div>\n' +
'      <div class="sl-body">\n' +
'        <h1 class="sl-title">' + esc(o.bodyTitle) + '</h1>\n' +
        (o.category ? '<div class="sl-meta"><span class="sl-cat">' + esc(o.category) + '</span></div>\n' : '') +
        (o.bodySub ? '<p class="sl-sub">' + esc(o.bodySub) + '</p>\n' : '') +
        (tagsHtml ? '<div class="sl-tags">' + tagsHtml + '</div>\n' : '') +
        shareBlock + '\n' +
'        <div class="sl-cta">\n' +
'          <a class="btn-hero btn-hero-primary" href="/memes.html">Browse all memes</a>\n' +
          (o.notFound ? '' : '<a class="btn-hero btn-hero-ghost" href="/memes.html?m=' + esc(o.memeId) + '">Open in Whamr</a>') + '\n' +
'        </div>\n' +
'      </div>\n' +
'    </div>\n' +
'  </main>\n' +
'  <footer class="footer"><div class="footer-inner">\n' +
'    <div class="footer-brand"><div class="logo footer-logo">whamr<span class="logo-dot">.</span></div><p class="footer-tag">Send the wham.</p></div>\n' +
'    <div class="footer-links"><a href="/memes.html">All memes</a><a href="/pricing.html">Pricing</a><a href="/help.html">Help</a><a href="/about.html">About</a></div>\n' +
'    <div class="footer-meta"><p>built for the send</p></div>\n' +
'  </div></footer>\n' +
  (o.notFound ? '' : ('<script>\n' + clientScript(o.memeId, o.title, o.canonical) + '\n</script>\n')) +
'</body>\n</html>';
}

function clientScript(memeId, title, url) {
  return '(function(){' +
    'var API=location.hostname==="localhost"||location.hostname==="127.0.0.1"?"http://localhost:4000":"https://whamr-be.onrender.com";' +
    'var ID=' + JSON.stringify(memeId) + ',TITLE=' + JSON.stringify(title) + ',URL=' + JSON.stringify(url) + ';' +
    'function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}' +
    'function ago(d){var s=Math.floor((Date.now()-new Date(d).getTime())/1000);if(s<60)return"just now";var m=Math.floor(s/60);if(m<60)return m+"m ago";var h=Math.floor(m/60);if(h<24)return h+"h ago";var dy=Math.floor(h/24);return dy+"d ago";}' +
    // Share buttons
    'var msg=encodeURIComponent(TITLE+" "+URL),u=encodeURIComponent(URL),t=encodeURIComponent(TITLE);' +
    'var share=document.getElementById("sl-share");' +
    'if(share){share.innerHTML=' +
      '\'<a class="sl-sbtn wa" target="_blank" rel="noopener" href="https://wa.me/?text=\'+msg+\'">WhatsApp</a>\'+' +
      '\'<a class="sl-sbtn tg" target="_blank" rel="noopener" href="https://t.me/share/url?url=\'+u+\'&text=\'+t+\'">Telegram</a>\'+' +
      '\'<a class="sl-sbtn x" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=\'+t+\'&url=\'+u+\'">X</a>\'+' +
      '\'<button class="sl-sbtn copy" id="sl-copy">Copy link</button>\';' +
      'var cp=document.getElementById("sl-copy");if(cp){cp.addEventListener("click",function(){if(navigator.clipboard){navigator.clipboard.writeText(URL).then(function(){cp.textContent="Copied ✓";setTimeout(function(){cp.textContent="Copy link";},1800);});}});}' +
    '}' +
    // Comments
    'var box=document.getElementById("sl-comments");' +
    'fetch(API+"/api/comments?meme_id="+encodeURIComponent(ID)).then(function(r){return r.json();}).then(function(d){' +
      'var cs=(d&&d.comments)||[];if(!cs.length){box.innerHTML=\'<p class="sl-muted">No comments yet — be the first.</p>\';return;}' +
      'box.innerHTML=cs.slice(0,15).map(function(c){return \'<div class="sl-comment"><div class="sl-comment-head"><span class="sl-comment-name">\'+esc(c.author_name||"Someone")+\'</span><span class="sl-comment-time">\'+ago(c.created_at)+\'</span></div><p class="sl-comment-text">\'+esc(c.text)+\'</p></div>\';}).join("");' +
    '}).catch(function(){box.innerHTML=\'<p class="sl-muted">Couldn\\\'t load comments right now.</p>\';});' +
  '})();';
}

const PAGE_CSS = [
  '.sl-wrap{max-width:720px;margin:0 auto;padding:8px 20px 64px;position:relative;z-index:2;}',
  '.sl-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;}',
  '.sl-media{background:#000;display:flex;align-items:center;justify-content:center;max-height:60vh;overflow:hidden;}',
  '.sl-media video,.sl-media img{width:100%;height:auto;max-height:60vh;object-fit:contain;display:block;}',
  '.sl-body{padding:22px 24px 26px;}',
  '.sl-title{font-size:clamp(20px,3.4vw,26px);font-weight:800;letter-spacing:-0.02em;color:var(--text);margin:0 0 8px;}',
  '.sl-meta{margin-bottom:12px;}',
  '.sl-cat{font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--accent);background:var(--accent-soft);border:1px solid rgba(255,51,102,0.2);padding:3px 10px;border-radius:100px;}',
  '.sl-sub{color:var(--text-muted);font-size:14px;line-height:1.6;margin:0 0 14px;}',
  '.sl-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;}',
  '.sl-tag{font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.04);border:1px solid var(--border);padding:3px 9px;border-radius:100px;}',
  '.sl-share{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;}',
  '.sl-sbtn{display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:100px;font-size:13.5px;font-weight:600;font-family:inherit;text-decoration:none;cursor:pointer;border:1px solid var(--border-strong);background:var(--surface-hover);color:var(--text);}',
  '.sl-sbtn.wa:hover{background:#25D366;border-color:#25D366;color:#06311a;}',
  '.sl-sbtn.tg:hover{background:#229ED9;border-color:#229ED9;color:#fff;}',
  '.sl-sbtn.x:hover{background:#fff;border-color:#fff;color:#000;}',
  '.sl-sbtn.copy:hover{border-color:var(--accent);color:var(--accent);}',
  '.sl-section{border-top:1px solid var(--border);padding-top:18px;margin-bottom:22px;}',
  '.sl-h2{font-size:15px;font-weight:700;color:var(--text);margin:0 0 12px;}',
  '.sl-comments{display:flex;flex-direction:column;gap:10px;margin-bottom:12px;}',
  '.sl-comment{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:11px 14px;}',
  '.sl-comment-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:4px;}',
  '.sl-comment-name{font-size:13px;font-weight:600;color:var(--text);}',
  '.sl-comment-time{font-size:11px;color:var(--text-subtle);}',
  '.sl-comment-text{font-size:13.5px;color:var(--text-muted);line-height:1.5;margin:0;}',
  '.sl-muted{font-size:13px;color:var(--text-muted);margin:0;}',
  '.sl-link{font-size:13px;font-weight:600;color:var(--accent);text-decoration:none;}',
  '.sl-cta{display:flex;gap:10px;flex-wrap:wrap;}',
  '.sl-cta .btn-hero{display:inline-flex;}',
].join('\n  ');

module.exports = async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'whamr-application.vercel.app';
  const base = 'https://' + host;
  const id = getId(req);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache the unfurl at the CDN so crawlers and repeat hits are fast.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');

  if (!id) { res.statusCode = 404; res.end(notFoundHtml(base)); return; }

  let meme = null;
  try {
    const map = await getMap(host);
    meme = map.get(id) || null;
  } catch (e) { meme = null; }

  if (!meme) { res.statusCode = 404; res.end(notFoundHtml(base)); return; }

  const isImage = !!IMAGE_TYPES[String(meme.type || '').toLowerCase()];
  const canonical = base + '/c/' + encodeURIComponent(id);
  const desc = (meme.category ? (meme.category.charAt(0).toUpperCase() + meme.category.slice(1) + ' meme') : 'A meme')
    + ' on Whamr — find it, send it, done.';

  const mediaHtml = isImage
    ? '<img src="' + esc(meme.src) + '" alt="' + esc(meme.title) + '" />'
    : '<video src="' + esc(meme.src) + '" autoplay muted loop playsinline controls></video>';

  // Images use the meme itself as the preview. Videos have no poster frame, so
  // we point og:image at a dynamically-rendered branded card (/api/og) — the
  // link still also carries og:video for players that use it.
  const ogImage = isImage
    ? meme.src
    : base + '/api/og?t=' + encodeURIComponent(meme.title) + '&c=' + encodeURIComponent(meme.category || '');

  const html = page({
    title: esc(meme.title) + ' · Whamr',
    description: desc,
    canonical: canonical,
    ogImage: ogImage,
    ogVideo: isImage ? '' : meme.src,
    bodyTitle: meme.title,
    bodySub: '',
    category: meme.category || '',
    tags: meme.tags || [],
    mediaHtml: mediaHtml,
    memeId: id,
    notFound: false,
  });

  res.statusCode = 200;
  res.end(html);
};
