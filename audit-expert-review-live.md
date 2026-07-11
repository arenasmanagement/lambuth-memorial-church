# Audit #1 — Expert Review

**Site reviewed:** https://www.lambuthmemorialumc.com (live production)
**Date of review:** July 10, 2026
**Method:** Independent live-site inspection — rendered pages, DOM/markup, structured data, headers, mobile viewport (390px), desktop viewport (1280px), and accessibility/contrast sampling. No local files reviewed. No competitor comparison.

**Review panel (perspectives applied):** Senior UX Designer · Senior UI Designer · Senior Front-End Developer · Senior Accessibility Specialist · Senior Technical SEO Specialist · Senior CRO Specialist · Senior Branding Consultant · Senior Digital Marketing Strategist · Senior Church Website Consultant.

**Priority key:** 🔴 Critical (fix before this is agency-deliverable) · 🟡 Important (should improve) · 🟢 Enhancement (nice-to-have).

---

## Executive summary

This is a genuinely well-built, premium-feeling website for a small church. The design system (charcoal / ivory / beige / gold with Fraunces + Inter) is cohesive and professional across all six pages; the technical foundation (per-page SEO metadata, structured data, sitemap, robots, GA4, Search Console) is comprehensive and correctly implemented; and the core conversion flows for visiting, contacting, and giving are strong.

The findings below are dominated by **finish-quality items rather than structural problems.** Two of them are the kind of thing an agency would not ship: a visible "Your photo here" placeholder on the homepage, and social links that point to generic Instagram/TikTok homepages rather than real profiles. Beyond those, the biggest opportunity is the total absence of real photography, which is what most limits warmth and visitor confidence for a church site. Everything else is polish.

---

## Branding

The brand is the strongest part of the site. It reads as intentional and high-end — unusual and impressive for a small congregation.

**What's working (quality evaluation):** The color system is disciplined and consistent — warm ivory backgrounds, charcoal dark sections, beige mid-tones, and a single gold accent used sparingly for CTAs and eyebrows. Typography pairs a high-contrast serif (Fraunces) for display with a clean sans (Inter) for body, applied consistently on every page. The UMC cross-and-flame logo is on-brand and legible in the header. Voice and tone ("You belong here," "Come as you are," "A place to start again") are warm, humble, and denominationally appropriate. Trust signals like a real address, embedded map, and a working contact path reinforce credibility.

### 🔴 Visible "Your photo here" placeholder on the homepage
The About-teaser section on the homepage renders a diagonal-striped box reading **"Your photo here — Add a real church photo as assets/community.jpg."** **Why it matters:** this is developer scaffolding exposed to real visitors; it signals "unfinished" and undercuts the otherwise premium impression more than any other single element. **Impact:** directly damages professionalism and trust at a key storytelling moment. **Recommendation:** replace with a real photo, or if none is available yet, remove the media column and let the text span full width so nothing looks broken.

### 🟡 No real photography anywhere on the site
The hero uses a flat charcoal background and every image slot is either the logo or a placeholder. **Why it matters:** for a church, photos of the actual building, sanctuary, and (with permission) people are the single biggest driver of warmth and "I can picture myself there." **Impact:** the site feels architecturally polished but emotionally abstract; visitors cannot see what Sunday actually looks like. **Recommendation:** prioritize a small set of real photos — exterior/entrance, worship space, and one candid gathering shot — to use in the hero and About teaser. This is the highest-leverage warmth improvement available.

---

## UI Design

### 🟢 Above-the-fold hero content depends on the scroll-reveal animation
On both desktop and mobile, the hero heading, subhead, and buttons animate in from opacity 0 on page load, so for roughly half a second to a second the most important first-impression area appears nearly empty (only the faint eyebrow shows). **Why it matters:** above-the-fold content should be visible on first paint; animating it in reads as a flash of missing content, especially on slower connections. **Impact:** minor but it slightly undermines the premium first impression the design otherwise earns. **Recommendation:** exclude first-viewport hero elements from the scroll-reveal (render them visible immediately) and reserve the reveal effect for sections below the fold.

**What's working:** Layout, spacing, and hierarchy are excellent — generous whitespace, a clear type scale, and a consistent three-tier button system (gold primary, dark, outline). Cards, the info bar, and service-time rows are visually consistent page to page. The gold primary button passes accessibility contrast (5.65:1). Nothing looks misaligned or cramped at either breakpoint.

---

## UX

### 🟡 "Watch Live" is promoted everywhere but currently lands on a placeholder
The livestream is not yet configured, so the Watch page shows a graceful "Livestream coming soon… our service will play right here each Sunday at 10:15 AM" panel with a "Watch on Facebook" fallback. Meanwhile "Watch Live" appears in the main nav and as a hero button. **Why it matters:** a primary navigation item and hero CTA lead to a not-yet-functional feature, which can mildly disappoint. **Impact:** low-to-moderate depending on whether the church actually streams yet. **Recommendation:** if streaming happens on Facebook today, wire that embed/link in now; if streaming is genuinely future, consider de-emphasizing "Watch Live" (e.g., keep the page but soften the hero CTA) until it's live. The fallback itself is well-designed — this is about matching prominence to reality.

### 🟢 "Contact" is absent from the desktop top navigation
Desktop nav is About · Watch Live · Events · Give · Visit Us. Contact is reachable via the "Visit Us" button and the footer, and it is present in the mobile menu. **Why it matters:** some users scan the top bar specifically for "Contact." **Impact:** minor; the "Visit Us" button and footer largely cover it. **Recommendation:** optionally surface Contact in the desktop bar, or confirm "Visit Us" is understood as the contact path.

**What's working:** User flows are clear and goal-oriented. The contact flow is strong — a labeled, low-friction form (name, email, optional phone, message, prayer-request option) with an embedded map, device-aware directions, and a warm "What to Expect" note. The donation flow (below) is genuinely well-executed. The mobile menu is a clean full-screen overlay with all links and a CTA, and it opens and closes correctly.

---

## Technical

### Performance
**What's working:** the site is lightweight — a small DOM, minimal JS/CSS, three self-hosted-via-Google woff2 font files (~150KB total), and no heavy frameworks. It renders effectively instantly. **🟡 One optimization:** the logo is a 1024×1024 PNG displayed at roughly 37–74px (and reused as the touch icon). **Why it matters:** it ships far more pixels than needed. **Impact:** small on modern connections, but it's wasted bytes on every page and every device. **Recommendation:** export the logo at display size (e.g., a 2× ~150px asset) and, if desired, a dedicated favicon/apple-touch-icon.

### Accessibility
**What's working:** `lang="en"`, a `<main>` landmark, properly labeled form fields, a hamburger button with `aria-label` and `aria-expanded`, focus styles defined in CSS, descriptive logo alt text, and no unlabeled buttons. Primary button and most body text meet WCAG AA.

- 🟡 **No skip-to-content link.** *Why:* keyboard and screen-reader users must tab through the full header on every page. *Impact:* minor friction for assistive-tech users. *Fix:* add a visually-hidden "Skip to content" link as the first focusable element.
- 🟢 **One low-contrast caption.** The small info-bar note ("Every other Saturday · check social media…") measures ~4.17:1 at ~13.6px, just under the 4.5:1 AA threshold for small text. *Fix:* darken that caption color slightly.
- 🟢 **No `prefers-reduced-motion` handling for the scroll-reveal.** *Why:* users who request reduced motion still get the fade/translate animations, and (per the hero note above) content is momentarily hidden. *Fix:* disable the reveal transition and force visibility under `@media (prefers-reduced-motion: reduce)`.

### Forms
**What's working — evaluated, not flagged:** the contact form has required/optional fields correctly marked, real labels, a prayer-request checkbox, and a hidden honeypot for spam. It submits without leaving the page. No changes needed.

### Donation implementation
**What's working — evaluated, not flagged:** the Give page offers frequency (One-Time / Monthly) and preset amounts ($10/$25/$50/$100/Custom), then hands off to PayPal via a donate link that **pre-fills the chosen amount** and sets recurring vs. one-time — so donors never pick an amount twice. The button ("Continue to Secure Donation") opens PayPal in a new tab with `rel="noopener"`, a live summary line ("$25 one-time gift"), and a security note. This is a strong, correct implementation.

- 🟢 **Add giving-confidence signals.** *Why:* donors give more readily when they see reassurance. *Impact:* modest lift in completion. *Recommendation:* a short line noting gifts are secure and, if applicable, tax-deductible (and that a receipt follows) would strengthen the ask. Keep it honest to the church's actual status.

### Embedded livestream
Covered under UX above — no iframe is present yet; the placeholder + Facebook fallback is handled gracefully. Evaluated as a good pending state.

### SEO implementation
**What's working — evaluated, not flagged:** every page has a unique, well-sized title and meta description, a canonical URL, Open Graph tags, and Twitter card tags. Confirmed on multiple pages (home and about), so it's applied consistently, not just on the homepage.

- 🟢 **Minor: About page `<h1>` duplicates the homepage** ("You Belong Here"). *Why:* a more descriptive H1 (e.g., "About Lambuth Memorial") is marginally better for search and screen-reader context. *Impact:* very small. *Fix:* optional per-page H1 wording.

### Structured data
**What's working:** a valid Schema.org `Church` JSON-LD block on the homepage with name, alternate name, URL, logo, image, description, full postal address, map link, and a `sameAs` pointing to the real Facebook page (correctly excluding the unset socials).

- 🟢 **Enrich the schema.** *Why:* worship time currently lives only in the prose description, not in machine-readable form, and there are no geo coordinates or telephone. *Impact:* modest local-SEO / rich-result upside. *Recommendation:* add `openingHoursSpecification` for the 10:15 AM Sunday service and `geo` coordinates once known. Only add fields that are true.

### Open Graph
**What's working — evaluated, not flagged:** a branded 1200×630 preview image is referenced site-wide with width/height/alt. Shares will render a clean card. (Swapping in a real church photo later would make shares warmer — enhancement, not a fix.)

### Sitemap & robots.txt
**What's working — evaluated, not flagged:** `robots.txt` allows all crawlers and references the sitemap; `sitemap.xml` serves correctly as XML. Both are correct.

### Analytics
**What's working — evaluated, not flagged:** GA4 is live via a single config-driven tag on all pages, firing on load and confirmed receiving data in the property's Realtime report. Implementation is clean.

### Search Console readiness
**What's working — evaluated, not flagged:** the domain property is verified, the sitemap is submitted, and the homepage has been submitted for indexing. Search Console is fully set up.

---

## Church Experience

This is where the copy shines and the missing photography hurts.

**What's working:** the site is warm, clear, and hospitable. Worship time (Sundays 10:15 AM) is stated repeatedly and unambiguously; the every-other-Saturday Bible Study and basketball schedule is now clearly explained with a "check social media for the next date" note; the address, embedded map, and device-aware "Get directions" make location effortless; and the "What to Expect" note plus "come as you are" voice lower the barrier for first-time visitors. Online giving is a confident, complete experience.

- 🟡 **Visitor confidence is capped by the lack of real imagery** (see Branding). *Why:* visitors decide partly on "does this feel like a place for me?", and they can't see the room, the door, or the people. *Impact:* the warm words aren't reinforced by warm visuals. *Recommendation:* the same photo set recommended above resolves this.
- 🟢 **Online worship experience is pending** (see UX/livestream). Acceptable as a graceful "coming soon."

---

## Conversion

Evaluating how effectively the site drives each intended action.

- **Visit the church — Strong.** "Plan Your Visit" is present in the header, hero, and repeatedly throughout; the What-to-Expect note and easy directions reduce hesitation.
- **Contact the church — Strong.** Low-friction, well-labeled form with a clear purpose and a prayer-request option.
- **Watch online — Weak (temporarily).** The path currently ends at a placeholder; only the Facebook fallback works. Resolves when the stream is wired in.
- **Give online — Strong.** Clear amounts, one-time/monthly, amount pre-filled into PayPal, security note. Adding tax-deductibility/receipt reassurance is the only lift left.
- **Follow on social media — Weakened by broken links.** See the Critical item below.

### 🔴 Instagram and TikTok links point to generic homepages, not real profiles
The footer (site-wide) and the contact page display Instagram and TikTok icons that link to `instagram.com` and `tiktok.com` root pages rather than the church's profiles; only Facebook resolves to a real page. **Why it matters:** these are effectively dead links on production — they take users nowhere useful, erode trust, and add nothing for SEO. **Impact:** directly undercuts the "follow us" conversion goal and looks unfinished. **Recommendation:** add the real Instagram/TikTok profile URLs, or — if those accounts don't exist — hide those two links entirely (the site is configured to hide any social link left blank). Do not ship them pointing at generic homepages.

---

## Scores

| Category | Score |
|---|---|
| Design (UI / visual) | 90 / 100 |
| UX | 86 / 100 |
| Branding | 85 / 100 |
| Mobile | 92 / 100 |
| Accessibility | 84 / 100 |
| Technical SEO | 93 / 100 |
| Church Experience | 87 / 100 |
| Conversion | 82 / 100 |
| Launch Readiness | 80 / 100 |
| **Overall** | **87 / 100** |

---

## Launch blockers vs. minor improvements

**Launch blockers (fix before this is agency-deliverable):**

1. 🔴 Remove/replace the "Your photo here" placeholder on the homepage.
2. 🔴 Fix or hide the Instagram/TikTok links (currently point to generic homepages).

Both are quick fixes — an hour of work total — and neither is structural.

**Everything else is a minor improvement, not a blocker:** real photography (high value but the site functions without it), the hero reveal-on-load flash, the "Watch Live" prominence vs. the pending stream, the logo asset size, the skip link, the small-caption contrast, reduced-motion handling, schema enrichment, and giving-confidence copy.

---

## Verdict

**If this website were delivered by our agency today, would we consider it production-ready?**

**Almost — but not quite, and only because of two small, fast-to-fix items.** The architecture, design system, responsiveness, technical SEO, analytics, and the contact and giving experiences are all at or above the standard we'd expect from a professional small-church build. If a client saw this, most of it would delight them.

We would not sign off with a **"Your photo here" placeholder visible on the homepage** or with **social links that go nowhere** — those are exactly the details a client (or a first-time visitor) notices, and they read as "unfinished" on an otherwise finished site. Resolve those two, and the site is production-ready as-is.

Beyond that bar, the one improvement we'd strongly encourage — though it isn't a blocker — is adding **real photography.** It's the difference between a site that looks professionally designed and one that also feels like the actual church. For a small congregation whose whole message is "come as you are, you belong here," letting visitors *see* the place is the most valuable enhancement remaining.
