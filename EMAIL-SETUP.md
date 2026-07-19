# Email Infrastructure — Lambuth Memorial UMC

Contact-form email for this site is sent through **Resend**, using a per-project
serverless function and per-project environment variables. This is the **reusable
template** for every Arenas Management client website (see "Reuse for future
projects" at the bottom).

---

## Architecture (one isolated setup per website)

| Piece | This site |
|---|---|
| Serverless API route | `api/contact.js` (Vercel function, no build step) |
| Frontend → API | `js/main.js` posts JSON to `SITE.formEndpoint` = `/api/contact` |
| Email provider | Resend (shared **account**, per-site **domain + API key**) |
| Verified sending domain | `lambuthmemorialumc.com` |
| Sender (From) | `Lambuth Memorial Website <contact@lambuthmemorialumc.com>` |
| Reply-To | the visitor's email (Pastor Mike just hits Reply) |
| Recipient (To) | `peery01@gmail.com` |
| Optional BCC | `arenasmanagementco@gmail.com` |

Every site is **independent**: its own Vercel project, its own env vars, its own
Resend domain + API key. Nothing here touches the Arenas Management project.

---

## Environment variables (Vercel → `lambuth-memorial-church` → Settings → Environment Variables)

Add these to **Production, Preview, and Development**. Never commit them; never
expose them to the frontend.

| Name | Value |
|---|---|
| `RESEND_API_KEY` | *(secret — create in Resend → API keys, scoped to `lambuthmemorialumc.com`; starts `re_`)* |
| `CONTACT_EMAIL` | `peery01@gmail.com` |
| `FROM_EMAIL` | `Lambuth Memorial Website <contact@lambuthmemorialumc.com>` |
| `BCC_EMAIL` | `arenasmanagementco@gmail.com` *(optional)* |

After adding them, redeploy (or push a commit) so the function picks them up.

---

## DNS records (add at Namecheap → Domain List → lambuthmemorialumc.com → Advanced DNS)

The domain is **added in Resend** and waiting on these records. Set TTL to
**Automatic**. In Namecheap the "Host" is the sub-part only (Resend shows it the
same way). Copy the long **DKIM value straight from the Resend domain page**
(Domains → lambuthmemorialumc.com → the copy button) so it's exact.

| Purpose | Type | Host | Value | Priority |
|---|---|---|---|---|
| DKIM | TXT | `resend._domainkey` | *(copy the `p=MIGf…` key from Resend)* | — |
| Bounce (MX) | MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | `10` |
| SPF | TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=none;` | — |

These live on the `send` and `resend._domainkey` subdomains, so they **do not
conflict** with any existing root email/MX records on the domain.

After adding them, open Resend → Domains → lambuthmemorialumc.com and click
**Verify** (DNS can take a few minutes to a couple of hours to propagate).

---

## Email contents

The function (`api/contact.js`) sends a professional HTML email **and** a
plain-text part (better deliverability / lower spam score) containing: Name,
Email, Phone (if provided), Subject (if a subject field is present), Prayer
request, Message, **Submission date/time** (US Central), and the **website
origin**. `Reply-To` is set to the visitor, so Reply in Gmail goes to them.

- **Subject:** `New Contact Form Submission — Lambuth Memorial UMC`
- Honeypot + validation reject bots/bad input silently.

---

## Reuse for future Arenas Management client websites

This is the standard. For a new client site:

1. New Vercel project + GitHub repo for the site.
2. Copy `api/contact.js` into the new repo (change the branded strings/origin).
3. Point the form at `/api/contact` (as `js/main.js` already does here).
4. In the **shared Resend account** (Pro): add the client's domain, add its DNS
   records, and create a **dedicated API key scoped to that domain**.
5. In the new Vercel project, set `RESEND_API_KEY`, `CONTACT_EMAIL`,
   `FROM_EMAIL`, and optional `BCC_EMAIL`.

Because each site has its own project, domain, key, and env vars, projects are
fully isolated — one client can never affect another.
