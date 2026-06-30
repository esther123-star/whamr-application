/* Vercel EDGE function — dynamic Open Graph card for video memes.
 *
 * /api/og?t=<title>&c=<category> renders a 1200x630 PNG: a dark, Whamr-branded
 * card showing the meme title + a category/VIDEO badge + the wordmark. Used as
 * the og:image for mp4 memes (which have no poster frame), so their share links
 * unfurl with a real preview image instead of a bare link card.
 *
 * Built with @vercel/og (Satori). Elements are plain React-element-shaped
 * objects (no JSX) so this stays a hand-authored .mjs with no build-time JSX
 * transform to depend on. All text is latin so the bundled default font covers
 * it. ESM (.mjs) keeps it isolated from the CommonJS api/c.js.
 */
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const REACT_ELEMENT = Symbol.for('react.element');
function el(type, style, children) {
  return { $$typeof: REACT_ELEMENT, type, key: null, ref: null, props: { style, children } };
}

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  let title = (searchParams.get('t') || 'A meme').trim().slice(0, 70) || 'A meme';
  let cat = (searchParams.get('c') || '').trim().slice(0, 30);
  const badge = (cat ? cat.toUpperCase() + ' · VIDEO' : 'VIDEO');
  const titleSize = title.length > 38 ? 64 : 88;

  const root = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '1200px',
      height: '630px',
      padding: '72px',
      backgroundColor: '#0a0a0f',
      backgroundImage:
        'radial-gradient(circle at 15% 8%, rgba(255,51,102,0.35), transparent 45%), radial-gradient(circle at 92% 96%, rgba(255,227,77,0.14), transparent 42%)',
      color: '#f5f5f7',
      fontFamily: 'sans-serif',
    },
    [
      // Badge (category · VIDEO)
      el(
        'div',
        {
          display: 'flex',
          alignSelf: 'flex-start',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '2px',
          color: '#ff3366',
          backgroundColor: 'rgba(255,51,102,0.14)',
          border: '2px solid rgba(255,51,102,0.42)',
          borderRadius: '100px',
          padding: '10px 30px',
        },
        badge
      ),
      // Title
      el(
        'div',
        {
          display: 'flex',
          fontSize: titleSize + 'px',
          fontWeight: 800,
          lineHeight: 1.08,
          letterSpacing: '-1px',
          color: '#f5f5f7',
          maxWidth: '1056px',
        },
        title
      ),
      // Footer: wordmark + tagline
      el(
        'div',
        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
        [
          el(
            'div',
            { display: 'flex', alignItems: 'baseline', fontSize: '46px', fontWeight: 800, letterSpacing: '-2px' },
            [
              el('div', { display: 'flex', color: '#f5f5f7' }, 'whamr'),
              el('div', { display: 'flex', color: '#ff3366' }, '.'),
            ]
          ),
          el('div', { display: 'flex', fontSize: '26px', color: '#8a8a96' }, 'find it, send it, done.'),
        ]
      ),
    ]
  );

  return new ImageResponse(root, {
    width: 1200,
    height: 630,
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
