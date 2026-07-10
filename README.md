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
| `formEndpoint` | Where the contact form posts — defaults to `/api/contact` (our own serverless function). You normally don't change this; the destination email + API key live in Vercel env vars. See **Contact form** below. |
| `facebookUrl` | Facebook page link (footer + Watch Live backup) |
| `instagramUrl` | Instagram profile link. **Placeholder** — replace with the real URL. Leave `""` empty to hide the Instagram link everywhere. |
| `tiktokUrl` | TikTok profile link. **Placeholder** — replace with the real URL. Leave `""` empty to hide the TikTok link everywhere. |
| `donationEnabled` | `true` = online giving is live; `false` = shows a "being set up" notice. |
| `paypalMerchantId` | The church's public PayPal Merchant ID (`RNMSDCJKQJP6U`). Used to build the amount-prefill donate link. |
| `donationItemName` | Description shown on PayPal's donation page. |
| `donationUrl` | Optional full-URL override (used as-is; amount not appended). Leave `""` for the normal amount-prefill flow. |
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

### Email — how contact works now
The website does **not** display any email address. Visitors reach the church through the
**contact form**, which delivers to Pastor Mike's inbox via Resend (see **Contact form**
below). Pastor Mike's personal email never appears on the site.

**Optional — a branded `info@lambuthmemorialumc.com` address (free, not required):** if you'd
like a professional church address later (for newsletters, giving receipts, etc.), you can set
one up for free with **Cloudflare Email Routing**: add the domain to a free
[Cloudflare](https://dash.cloudflare.com) account, open **Email → Email Routing**, enable it,
then create `info@…` and point its destination at Pastor Mike's inbox. This is independent of
the contact form and isn't needed for the form to work.

### Contact form — Resend (same standard as arenasmanagementco.com)
The contact form on **Contact / Visit** sends every submission to Pastor Mike Peery at
**peery01@gmail.com** using **[Resend](https://resend.com)** (free tier: 3,000 emails/month).
It's the same architecture as the Arenas Management Co. site.

How it flows: the form POSTs to our own serverless function at **`api/contact.js`** (runs on
Vercel), which calls Resend to email the message to Pastor Mike. The visitor's email is set as
**Reply-To**, so he just hits **Reply** in Gmail and it goes straight to the person. No email
address appears anywhere on the website — the destination and the API key live only in Vercel's
Environment Variables (and this README).

**One-time setup (~10 minutes):**

1. **Create a free Resend account** at [resend.com](https://resend.com) (signing in with the
   church Google account is fine).
2. **Add & verify the domain.** In Resend → **Domains → Add Domain**, enter
   `lambuthmemorialumc.com`. Resend shows a few DNS records (an MX record and some TXT records
   for SPF/DKIM). Add those at **Namecheap → Domain → Advanced DNS** (same place we set up the
   site), then click **Verify** in Resend. *(Ask me and I'll add the records in Namecheap for
   you — I already have access.)*
   - Verifying lets emails send from a branded address like `contact@lambuthmemorialumc.com`.
   - Not ready to verify? You can start with Resend's test sender `onboarding@resend.dev`
     (step 5's `FROM_EMAIL`) and verify the domain later.
3. **Create a NEW API key just for this site.** Resend → **API Keys → Create API Key**, name it
   e.g. "Lambuth". Copy it (starts with `re_`). **Do not reuse another site's key** — a separate
   key means you can rotate it later without affecting any other site. Keep it secret (it goes
   in Vercel env only, never in the code).
4. **Confirm delivery to Gmail.** Nothing to click for Resend, but do a real test in step 6.
5. **Add environment variables in the LAMBUTH Vercel project only.** Vercel → the
   `lambuth-memorial-church` project → **Settings → Environment Variables** → add these
   (Production + Preview). These live in this project only and don't touch any other project:
   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | the `re_...` key from step 3 (the Lambuth-specific key) |
   | `CONTACT_EMAIL` | `peery01@gmail.com` |
   | `BCC_EMAIL` | `arenasmanagementco@gmail.com` (blind copy — optional; remove to send with no BCC) |
   | `FROM_EMAIL` | `Lambuth Memorial <onboarding@resend.dev>` for now; switch to `Lambuth Memorial <contact@lambuthmemorialumc.com>` after the domain verifies |
6. **Redeploy & test.** Trigger a redeploy (push any change, or Vercel → Deployments →
   Redeploy). Open the live Contact page, send a test message, and confirm it lands in
   **peery01@gmail.com** (and, if `BCC_EMAIL` is set, a blind copy in arenasmanagementco@gmail.com).
   Then hit **Reply** in Gmail and check the reply is addressed to the email you typed in the
   form (that's Reply-To working).

**What the form does (already built — no code changes needed):**
- Collects **Name (required), Email (required), Phone (optional), Message (required),** and a
  **prayer-request** checkbox.
- Email subject: **"New message from Lambuth Memorial website"**; the body includes name, email,
  phone, whether it's a prayer request, and the message, plus a "Reply to …" button.
- **To:** `CONTACT_EMAIL` (Pastor Mike). **BCC:** `BCC_EMAIL` if set (the agency inbox).
  **Reply-To = the visitor's email** (all set server-side in `api/contact.js`).
- **Spam protection:** a hidden honeypot field (bots fill it, humans don't — those are silently
  dropped), plus server-side validation. You can add Resend's own filtering later if needed.
- The visitor **stays on the page** and sees *"Thank you! Your message has been sent
  successfully. Pastor Mike will get back to you as soon as possible."* — or a friendly error.
  No redirect.

### Using one Resend account for several client sites (safe when done this way)
One Resend account can serve many sites. To keep every site independent and never break another:
- **Verify each domain separately** under the one account (Lambuth: `lambuthmemorialumc.com`;
  Arenas: `arenasmanagementco.com`). Adding a domain never affects existing ones.
- **Create a separate API key per site** (name them). Never reuse or regenerate another site's
  key — rotating a shared key would break every site using it.
- **Keep env vars in each site's own Vercel project.** They're project-scoped and don't leak
  between projects, so changing Lambuth's variables cannot affect Arenas.
- **Only shared thing:** the account-wide free quota (3,000 emails/month) and billing. Both
  sites draw from the same pool — plenty for a church + agency, just good to know.

> This pattern (Resend + a small `api/contact` function + Reply-To + honeypot) is the reusable
> standard for every client site. For a new site: copy `api/contact.js`, verify that site's
> domain in Resend, create a **new** API key for it, and set its env vars in **its own** Vercel
> project.

### Turning on the livestream later — YouTube Live
Goal: people watch **on the website**, not just on Facebook. Workflow: **OBS → YouTube Live → embedded here.**
1. Stream from OBS to your church's YouTube channel (YouTube Live is free).
2. Get an embed URL — either a specific stream `https://www.youtube.com/embed/VIDEO_ID`,
   or an always-current one for your channel:
   `https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID`.
3. Paste it into `livestreamEmbedUrl` in `js/main.js`. Save, commit, push. The player turns
   on by itself, and Facebook stays as a backup button.

### Online giving — PayPal (live)
Giving is connected to the church's PayPal Business account (**Merchant ID `RNMSDCJKQJP6U`**).
The Give page is the primary experience: the visitor chooses **One-Time / Monthly** and an
**amount** ($10/$25/$50/$100/Custom), then "Continue to Secure Donation" opens PayPal with the
**amount already filled in** — they never choose it twice. The website never processes payments;
PayPal handles the amount, payment method, and card/security.

- **One-Time:** link uses `no_recurring=1` → amount pre-filled, straight to payment.
- **Monthly:** link uses `no_recurring=0` → amount pre-filled, and the donor ticks "Make this a
  monthly donation" on PayPal (PayPal has no URL parameter to pre-tick it).

**To change anything (in `js/main.js`):**
- `donationEnabled: true/false` — turn giving on/off (off shows a "being set up" notice).
- `paypalMerchantId` — the church's PayPal Merchant ID (public/safe to expose).
- `donationItemName` — the description shown on PayPal's page.
- Suggested amounts ($10/$25/$50/$100) live in `give.html` (the `data-amount` buttons).
- `donationUrl` — optional full-URL override; if set it's used as-is and the amount is NOT
  appended (only for switching to a hosted PayPal button/page later).

> Note: the amount-prefill link uses PayPal's Merchant-ID donate URL. This gives the cleanest
> "website-is-primary" flow. The trade-off vs. a hosted PayPal donate button is that the hosted
> button offers a "cover the fees" option but does **not** allow pre-filling the amount from the
> site. We chose amount-prefill to match the goal of not making donors choose twice.

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
| [Resend](https://resend.com) | Sends contact-form emails (via `api/contact.js`) with Reply-To to the visitor | Free tier (3,000/mo) |
| [YouTube Live](https://youtube.com) | Livestream that embeds on the Watch page (OBS → YouTube → site) | Free |
| [PayPal Donate](https://www.paypal.com/) | Online giving link | No monthly fee; per-transaction fee only |
| [Google Analytics](https://analytics.google.com) + [Search Console](https://search.google.com/search-console) | See visitors & help Google find the site | Free (optional) |
| [Cloudflare Email Routing](https://www.cloudflare.com/) | *Optional* — a branded `info@…` inbox (not needed for the contact form) | Free |

**Suggested order to set these up:** GitHub + Vercel first (get it live) → custom domain →
Resend contact form (verify domain + Vercel env vars) → YouTube Live
(`livestreamEmbedUrl`) → PayPal (`donationUrl`) → Analytics/Search Console last.

> **Adding Google Analytics later (optional):** create a free GA4 property, copy its small
> snippet, and paste it just before `</head>` in each page (or ask and it can be wired in
> once, config-driven, like the other settings).

## Notes
- No AI-generated images and no invented ministries/programs — content is real and
  provided by the church.
- No email address appears anywhere on the site. The contact form is the email path; it
  delivers to Pastor Mike via Resend with Reply-To set to the visitor.
- The only server-side code is `api/contact.js` (a tiny Vercel serverless function). It runs
  on Vercel's free tier — no server to manage or pay for.
