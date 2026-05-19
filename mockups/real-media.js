/**
 * real-media.js — Whamr Mockup Media Injector
 * Replaces all picsum.photos placeholder images with real stickers and memes
 * from the local media library. Drop into any mockup HTML page.
 */
(function () {

  /* ── Load catalog ── */
  fetch('./catalog.json')
    .then(r => r.json())
    .then(catalog => inject(catalog))
    .catch(() => console.warn('[Whamr] catalog.json not found — run from the mockups/ folder'));

  function inject(catalog) {
    const stickers = catalog.filter(c => c.type === 'sticker');
    const memes    = catalog.filter(c => c.type === 'meme');
    const byCategory = {};
    memes.forEach(m => {
      if (!byCategory[m.category]) byCategory[m.category] = [];
      byCategory[m.category].push(m);
    });
    const allMemes = [...memes];

    let si = 0; // sticker index
    let mi = 0; // meme index

    /* helper: round-robin pick */
    function pickSticker() { return stickers[si++ % stickers.length]; }
    function pickMeme(cat) {
      const pool = (cat && byCategory[cat] && byCategory[cat].length)
        ? byCategory[cat]
        : allMemes;
      return pool[mi++ % pool.length];
    }

    /* ── 1. Replace picsum <img> tags with real stickers ── */
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (!src.includes('picsum.photos')) return;
      const item = pickSticker();
      img.src = `./media/${item.path}`;
      img.alt = item.title;
      img.loading = 'lazy';
      img.style.objectFit = 'cover';
      img.style.width  = img.style.width  || '100%';
      img.style.height = img.style.height || '100%';
    });

    /* ── 2. Replace meme video cards ── */
    // Containers that are visually "meme card" slots (grid cards, trending rows)
    const CARD_SELECTORS = [
      '.card-media-wrap', '.meme-video-wrap', '.featured-card',
      '[data-meme-slot]', '.trending-item-media', '.explore-card-media'
    ];
    document.querySelectorAll(CARD_SELECTORS.join(',')).forEach(el => {
      const cat = el.closest('[data-cat]')?.dataset.cat || null;
      const item = pickMeme(cat);
      const vid = document.createElement('video');
      vid.src          = `./media/${item.path}`;
      vid.autoplay     = true;
      vid.loop         = true;
      vid.muted        = true;
      vid.playsInline  = true;
      vid.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
      el.innerHTML = '';
      el.appendChild(vid);
    });

    /* ── 3. Inject real titles / category / tags into card overlays ── */
    document.querySelectorAll('.card-title, .meme-card-title').forEach((el, i) => {
      const item = memes[i % memes.length];
      if (item) el.textContent = item.title;
    });

    document.querySelectorAll('.card-subtitle, .card-cat, .meme-cat-label').forEach((el, i) => {
      const item = memes[i % memes.length];
      if (item) el.textContent = item.category;
    });

    document.querySelectorAll('.card-tags, .meme-tags').forEach((el, i) => {
      const item = memes[i % memes.length];
      if (!item) return;
      el.innerHTML = item.tags
        .map(t => `<span class="tag-pill" style="background:#FFF1EC;color:#FF4500;font-size:10px;font-weight:700;padding:2px 8px;border-radius:100px;letter-spacing:.04em">${t}</span>`)
        .join(' ');
    });

    /* ── 4. Update library counts in the page ── */
    const TOTAL = catalog.length;
    const STICKERS = stickers.length;
    const MEME_COUNT = memes.length;

    document.querySelectorAll('[data-count="total"]').forEach(el => { el.textContent = TOTAL; });
    document.querySelectorAll('[data-count="stickers"]').forEach(el => { el.textContent = STICKERS; });
    document.querySelectorAll('[data-count="memes"]').forEach(el => { el.textContent = MEME_COUNT; });

    /* ── 5. Badge injection: show real category counts ── */
    const catCounts = {};
    catalog.forEach(c => { catCounts[c.category] = (catCounts[c.category] || 0) + 1; });
    document.querySelectorAll('[data-cat-count]').forEach(el => {
      const cat = el.dataset.catCount;
      if (catCounts[cat]) el.textContent = catCounts[cat];
    });

    console.log(`[Whamr] Injected ${TOTAL} real assets: ${MEME_COUNT} memes + ${STICKERS} stickers`);
  }

})();
