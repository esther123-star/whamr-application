# Whamr

**Send the wham.** A static meme discovery app for MP4 videos and GIF files. Vanilla HTML, CSS, and JavaScript. No frameworks. Deploys anywhere, especially Vercel.

## What's inside

```
whamr-app/
├── index.html                    # markup and structure
├── style.css                     # dark theme, grid, cards, modal, share sheet
├── script.js                     # rendering, search, filter, favorites, share, upload
├── vercel.json                   # Vercel deployment config
├── Whamr-Project-Brief.docx      # the write-up for your boss
├── data/
│   └── memes.json                # your meme index (edit this to add/remove items)
└── assets/
    ├── videos/                   # drop your .mp4 files here
    └── gifs/                     # drop your .gif files here
```

## Features

- Responsive grid that adapts to screen size (1 to 6 columns)
- Search by title, category, or tags
- Category filter pills (auto-generated from your data)
- **Favorites**: heart any meme to save it, see them all under a dedicated Favorites tab
- **Share sheet**: send any meme to WhatsApp, Telegram, X, Facebook, Reddit, LinkedIn, Pinterest, or email. Copy link or use your phone's native share menu.
- **Shareable meme URLs**: every meme gets its own link like `yoursite.com/?m=m001` that opens straight to the preview
- Click any card to open a full preview modal with download and all actions
- Hover on video cards to autoplay muted preview
- Upload button for adding your own MP4/GIF files (stored in your browser via IndexedDB)
- Dark theme, smooth animations, mobile-responsive down to 380px
- Back/forward browser navigation works correctly

## Running it locally

Because `script.js` uses `fetch()` to load `memes.json`, you cannot just double-click `index.html`. You need to serve the folder over HTTP.

Pick one:

```bash
# Python 3 (comes with macOS and most Linux distros)
python3 -m http.server 8000

# Node
npx serve .

# VS Code: install Live Server extension, right-click index.html → "Open with Live Server"
```

Then open `http://localhost:8000` in your browser.

## Adding your own memes — three ways

### Way 1: Bundle them with the app (simplest for a deploy)

1. Drop your `.mp4` files into `assets/videos/`
2. Drop your `.gif` files into `assets/gifs/`
3. Open `data/memes.json` and add entries:

```json
{
  "id": "m100",
  "title": "Friday mood",
  "type": "mp4",
  "src": "assets/videos/friday-mood.mp4",
  "category": "reactions",
  "tags": ["friday", "mood", "weekend"]
}
```

4. Push to your hosting and you're done.

Heads up on file sizes: GitHub rejects single files over 100MB and warns above 50MB. Vercel's free tier has a 100MB deployment limit total. If your memes are large, use Way 2.

### Way 2: Host files on Cloudinary (or S3, etc.)

1. Upload your MP4s and GIFs to Cloudinary (free tier is generous)
2. In `memes.json`, use the full URL in the `src` field:

```json
{
  "id": "m101",
  "title": "Friday mood",
  "type": "mp4",
  "src": "https://res.cloudinary.com/your-account/video/upload/v1/friday-mood.mp4",
  "category": "reactions",
  "tags": ["friday", "mood"]
}
```

Your code stays light, no file-size worries.

### Way 3: Upload button inside the app

The **Upload** button in the header lets you pick `.mp4` or `.gif` files from your device. They get stored in IndexedDB (browser storage) and show up in the grid immediately.

Important caveats:
- These uploads live **only in your browser on your device**. Anyone else visiting the site will not see them.
- Clear your browser data and they're gone.
- Good for personal use, quick testing, or demos. Not good for sharing content publicly.

Uploaded memes show a "yours" tag on hover and have a Delete button in the modal.

## Data schema

Each meme entry in `memes.json`:

```json
{
  "id": "m001",              // any unique string
  "title": "Friday mood",    // shown in card overlay + modal
  "type": "mp4",             // either "mp4" or "gif"
  "src": "assets/videos/x.mp4",  // relative path OR full URL
  "category": "reactions",   // auto-adds a filter pill
  "tags": ["tag1", "tag2"]   // searchable; shown as chips in modal
}
```

Only `id`, `title`, `type`, and `src` are strictly required. `category` and `tags` are optional but make search and filtering work better.

## Deploying to Vercel (step by step)

1. Make a free account at [vercel.com](https://vercel.com) and at [github.com](https://github.com) if you don't have them
2. Create a new GitHub repository (call it `whamr-app` or whatever you like) and upload this entire folder to it. You can do this through the GitHub website — click "uploading an existing file" on a new empty repo.
3. On Vercel, click **Add New → Project**
4. Find and **Import** your GitHub repo
5. Vercel auto-detects it as a static site. Click **Deploy**.
6. In about 30 seconds you get a free `.vercel.app` URL. That's your live demo.

Every time you push changes to the GitHub repo, Vercel redeploys automatically.

## Deploying elsewhere

This is a pure static site. Works on:
- Netlify (drag the folder onto netlify.com/drop)
- GitHub Pages
- Cloudflare Pages
- Any server that serves static files

## Customizing

- **Colors**: edit the CSS variables at the top of `style.css`. Main accent is `--accent` (`#ff3366`).
- **Fonts**: change the Google Fonts link in `index.html` and the `--font-display` / `--font-body` variables.
- **Grid density**: in `.grid` inside `style.css`, change `minmax(260px, 1fr)` — smaller number = denser grid.
- **Categories**: just add them to your `memes.json` entries. Pills appear automatically.

## Notes on the current features

**Favorites** are stored in `localStorage` under the key `whamr-favorites`. Clearing browser data wipes them.

**Shareable URLs**: when the preview modal is open, the URL contains `?m=<id>`. Copying that URL and pasting it elsewhere opens the app straight to that meme's preview.

**Share sheet** opens your phone's native share sheet on mobile (when available), and falls back to the in-app grid of platform buttons. Clicking a platform opens it in a new tab with the meme link pre-filled.

**Uploaded memes** can't be shared publicly because the file exists only on your device. The Share button will show a message explaining this if you try.

ESC closes any open modal or sheet.
