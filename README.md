# Lambuth Memorial Church — Website

A simple, fast, static website for Lambuth Memorial Church in Jackson, TN.
Plain HTML, CSS, and JavaScript. No backend, no database, no build step.
Deployable free on Vercel via GitHub.

**Message:** *You Belong Here — A place to start again.*

---

## What's in here

```
lambuth-memorial-church/
├── index.html        Home
├── about.html        About
├── watch.html        Watch Live
├── events.html       Events
├── give.html         Give
├── contact.html      Contact & Visit (map + message form)
├── css/
│   └── styles.css     All styling (design system)
├── js/
│   └── main.js        ⭐ ALL editable site settings live here
├── assets/            Your church photos go here
│   └── README.txt
├── .gitignore
└── README.md
```

---

## ⭐ How to edit the site (the important part)

**Almost everything you'll want to change lives in one file: `js/main.js`.**
Open it and edit the `SITE` block at the top. You can change:

| Setting | What it does |
|---|---|
| `churchName` | Full church name, shown in the footer copyright: *Lambuth Memorial United Methodist Church* |
| `churchNameShort` | Short name (*Lambuth Memorial UMC*) for tight spaces |
| `address` | Street address (updates everywhere at once) |
| `churchEmail` | Church inbox that the contact form delivers to. **Not shown anywhere on the site** — it's used only by the form and documented here. Never put the pastor's personal email here — see **Email** below. |
| `formEndpoint` | Contact-form address (Formspree). See **Contact form** below. |
| `facebookUrl` | Facebook page link (footer + Watch Live backup) |
| `instagramUrl` | Instagram profile link. **Placeholder** — replace with the real URL. Leave `""` empty to hide the Instagram link everywhere. |
| `tiktokUrl` | TikTok profile link. **Placeholder** — replace with the real URL. Leave `""` empty to hide the TikTok link everywhere. |
| `donationUrl` | PayPal giving link. **Leave `""` empty** and the Give page shows a "coming soon" message. Paste a PayPal link and a "Donate with PayPal" button appears automatically. |
| `livestreamEmbedUrl` | YouTube Live embed. **Leave `""` empty** and Watch Live shows a "Livestream coming soon" placeholder shaped like the player. Paste a YouTube embed URL and it plays in-page. |
| `mapsEmbedUrl` | The embedded Google Map on the Contact page |
| `mapsLinkUrl` | Fallback "Get directions" link. Note: the site now auto-picks the map app per device (Apple Maps on iPhone/iPad, default nav on Android, Google Maps on desktop), and the address text itself is tappable. |
| `services` | Service/gathering times (name, day, time). These render automatically on Home and Events. |

You do **not** need to touch the HTML for any of the above — the pages read from `js/main.js`.

### Adding your real photos
1. Put photos in the `assets/` folder (see `assets/README.txt`).
2. Follow the short instructions there to switch them on in `index.html`.
3. **Pastor photo:** save it as `assets/pastor.jpg`, then in `about.html` replace the
   pastor `photo-slot` block with `<img src="assets/pastor.jpg" alt="Pastor [Name]" />`
   and fill in the name/bio placeholders. (Instructions are in a comment right there.)
> No AI-generated images — use your own real church photos.

### Email (free, private) — Cloudflare Email Routing
The website only ever shows the **public** address `info@lambuthmemorialumc.com`. Set that
address up for **free** so it quietly forwards to the pastor's real inbox — the pastor's
personal email never appears on the site:
1. Add your domain to a free [Cloudflare](https://dash.cloudflare.com) account.
2. Open **Email → Email Routing** and enable it (adds a few DNS records for you).
3. Create a **custom address** `info@lambuthmemorialumc.com` and set its **destination**
   to the pastor's personal email. Verify the destination once.
4. Done. Anything sent to `info@…` now lands in the pastor's normal inbox. To change who
   receives it later, just edit the destination in Cloudflare — no website change needed.

### Contact form (free) — Formspree
The contact form works in two modes:
- **Before setup:** it opens the visitor's email app addressed to `churchEmail`. Works out of the box.
- **After setup (recommended):** it emails submissions to you via Formspree (free tier).
  1. Sign up at [Formspree](https://formspree.io) and create a new form.
  2. Point the form's notification email at `info@lambuthmemorialumc.com` (which Cloudflare
     then forwards to the pastor).
  3. Copy your endpoint (looks like `https://formspree.io/f/abcdwxyz`) into `formEndpoint`
     in `js/main.js`. Save, commit, push. That's it.

  The form collects **name, email, phone (optional), message, and a prayer-request checkbox**.

### Turning on the livestream later — YouTube Live
Goal: people watch **on the website**, not just on Facebook. Workflow: **OBS → YouTube Live → embedded here.**
1. Stream from OBS to your church's YouTube channel (YouTube Live is free).
2. Get an embed URL — either a specific stream `https://www.youtube.com/embed/VIDEO_ID`,
   or an always-current one for your channel:
   `https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID`.
3. Paste it into `livestreamEmbedUrl` in `js/main.js`. Save, commit, push. The player turns
   on by itself, and Facebook stays as a backup button.

### Turning on online giving later — PayPal
1. Create a free PayPal **Donate** button/link (no monthly fee, only per-transaction fees).
2. Paste the link (e.g. `https://www.paypal.com/donate/?hosted_button_id=XXXXXXXX`) into
   `donationUrl` in `js/main.js`. Save, commit, push. The "Donate with PayPal" button appears.

---

## Preview it on your computer (optional)

Just double-click `index.html` to open it in your browser. That's it.

For a more accurate local preview (recommended, since some browsers block
local file features), run a tiny local server from this folder:

```bash
# Python 3 (already on most Macs)
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser. Press `Ctrl+C` to stop.

---

## 🚀 Deploying with GitHub + Vercel — step by step

You'll do this once. After that, updating the site is three commands.

### One-time setup you need
- A free [GitHub](https://github.com) account.
- A free [Vercel](https://vercel.com) account (sign up with your GitHub account — easiest).
- Git installed. On Mac, open **Terminal** and run `git --version`. If it prompts to
  install developer tools, click Install.

---

### Step 1 — Create the GitHub repository

1. Go to <https://github.com/new>.
2. **Repository name:** `lambuth-memorial-church`
3. Leave it **Public** (or Private — both work with Vercel).
4. **Do NOT** check "Add a README" / .gitignore / license — this project already has them.
5. Click **Create repository**. Leave that page open; you'll copy a URL from it in Step 2.

---

### Step 2 — Push the files from Terminal

Open **Terminal** and point it at this project folder:

```bash
cd ~/Desktop/Lambuth
```

Then run these commands one at a time:

```bash
git init
git add .
git commit -m "Initial commit: Lambuth Memorial Church website"
git branch -M main
```

Now connect it to the GitHub repo you made in Step 1. Copy the URL GitHub showed you
(it looks like `https://github.com/YOUR-USERNAME/lambuth-memorial-church.git`), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/lambuth-memorial-church.git
git push -u origin main
```

If Git asks you to sign in, follow the browser prompt (or use a
[Personal Access Token](https://github.com/settings/tokens) as the password).

Refresh your GitHub repo page — your files should now be there.

---

### Step 3 — Connect the repo to Vercel

1. Go to <https://vercel.com/new>.
2. Sign in with GitHub if you haven't.
3. Under **Import Git Repository**, find `lambuth-memorial-church` and click **Import**.
   (If you don't see it, click "Adjust GitHub App Permissions" and grant access.)

---

### Step 4 — Deploy

1. On the import screen, leave everything at its defaults:
   - **Framework Preset:** Other
   - **Build Command:** *(leave empty)*
   - **Output Directory:** *(leave empty / root)*
   - **Root Directory:** `./`
2. Click **Deploy**.
3. Wait about a minute. Vercel gives you a live URL like
   `https://lambuth-memorial-church.vercel.app`. That's your live site. 🎉

> **Custom domain (e.g. lambuthmemorialumc.com):** In Vercel, open the project →
> **Settings → Domains → Add**, then follow Vercel's instructions to point your
> domain's DNS at Vercel.

---

### Step 5 — Making future edits (the everyday workflow)

Whenever you change something (edit `js/main.js`, add a photo, tweak text):

```bash
cd ~/Desktop/Lambuth
git add .
git commit -m "Describe what you changed"
git push
```

That's it. Vercel automatically detects the push and redeploys your site in
about a minute. Refresh your live URL to see the changes.

**Quick reference:**
- `git add .` — stage all your changes
- `git commit -m "message"` — save a snapshot with a note
- `git push` — send it to GitHub, which triggers Vercel to redeploy

---

## Recommended low-cost tech stack

Everything this site needs can run on free tiers. The only thing that ever costs money is
PayPal's per-transaction fee on donations — there are **no monthly fees** anywhere.

| Service | Purpose | Cost |
|---|---|---|
| [GitHub](https://github.com) | Stores the website's code | Free |
| [Vercel](https://vercel.com) | Hosts the live site, auto-deploys on push | Free |
| [Cloudflare Email Routing](https://www.cloudflare.com/) | Forwards `info@…` to the pastor's inbox (keeps personal email private) | Free |
| [Formspree](https://formspree.io) | Delivers contact-form submissions | Free tier |
| [YouTube Live](https://youtube.com) | Livestream that embeds on the Watch page (OBS → YouTube → site) | Free |
| [PayPal Donate](https://www.paypal.com/) | Online giving link | No monthly fee; per-transaction fee only |
| [Google Analytics](https://analytics.google.com) + [Search Console](https://search.google.com/search-console) | See visitors & help Google find the site | Free (optional) |

**Suggested order to set these up:** GitHub + Vercel first (get it live) → custom domain →
Cloudflare Email Routing (`info@…`) → Formspree (`formEndpoint`) → YouTube Live
(`livestreamEmbedUrl`) → PayPal (`donationUrl`) → Analytics/Search Console last.

> **Adding Google Analytics later (optional):** create a free GA4 property, copy its small
> snippet, and paste it just before `</head>` in each page (or ask and it can be wired in
> once, config-driven, like the other settings).

## Notes
- No AI-generated images and no invented ministries/programs — content is real and
  provided by the church.
- The pastor's personal email never appears on the site. The public address is
  `info@lambuthmemorialumc.com`, forwarded privately via Cloudflare.
- The contact form posts to Formspree once `formEndpoint` is set; until then it falls back
  to opening the visitor's email app. Either way, nothing runs on a server you have to pay for.
