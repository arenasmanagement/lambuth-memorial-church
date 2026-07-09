# Audit 1 — Expert Review
### Lambuth Memorial United Methodist Church — lambuthmemorialumc.com

**Review type:** Multi-disciplinary senior expert panel (UX, UI, Front-End, Accessibility, Technical SEO, CRO, Branding, Digital Marketing, Church Website Consulting)
**Scope:** Live production site — Home, About, Watch Live, Events, Give, Contact (desktop + mobile)
**Method:** Live-site inspection (home + mobile navigation reproduced in-browser) plus a full technical review of the deployed build. No competitor comparison; not a first-visitor walkthrough — evaluated strictly as industry experts.
**Priority key:** 🔴 Critical (fix before launch) · 🟡 Important (should improve) · 🟢 Enhancement (nice to have)

---

## Executive summary

This is, at the craft level, a genuinely strong small-church website. The design system is senior-grade: a disciplined charcoal/ivory/gold palette, a confident editorial type pairing (Fraunces display + Inter body), generous spacing, and a consistent component language (buttons, cards, service rows, section rhythm). The copy is warm and on-strategy ("You Belong Here," "Come as you are," "No pressure"). The information architecture is lean and correct for a church of this size, and the technical foundation (static site, HTTPS, custom domain, CDN, device-aware maps) is clean and fast.

However, **the live site is not launch-ready**, and the gap is not about taste — it's about a handful of concrete, high-severity functional failures and a near-total absence of real imagery. As of this review the **mobile navigation is broken** (the menu renders inside the header strip while page content shows through), the **contact form does not deliver** (it is wired but the mail service is not connected, so submissions error out), the **Instagram and TikTok links are placeholders that dead-end** on the platforms' home pages, and **every photograph on the site is a placeholder tile** (hero, community, pastor). Giving and live-streaming are honest "coming soon" states, which is acceptable short-term, but combined with the above they leave several primary conversion paths as dead ends on the live site.

The good news: the foundation is excellent and the blockers are well-defined and fast to resolve. This is a site that goes from "not launchable" to "genuinely impressive for the category" with a focused punch-list — mostly real photos, connecting the form, fixing the mobile menu (a fix is already staged), and correcting the social links, followed by SEO/social-sharing hardening.

---

## 🔴 Blockers at a glance (the "do not launch until fixed" list)

1. **Mobile menu is broken on the live site** — primary navigation fails on the device where most church traffic lives.
2. **Contact form does not send** — the church literally cannot receive messages submitted through it.
3. **Instagram & TikTok links dead-end** — they point to generic platform homepages, not real profiles.
4. **No real photography anywhere** — hero, community, and pastor images are placeholder tiles; a church site with zero real faces reads as unfinished and impersonal.
5. **No social-sharing metadata (Open Graph/Twitter)** — when the church shares its own links on Facebook (its main channel), there is no preview image, title, or description.

---

## Branding

**Strengths.** Brand consistency is excellent. The real UMC cross-and-flame logo is used correctly and consistently in the header (linked home) and as the favicon; the footer carries a tasteful "Lambuth Memorial / United Methodist Church" logotype. The palette (deep charcoal, warm ivory, beige, muted gold) is cohesive and applied with restraint. Typography is distinctive and appropriate — the serif display gives an "established, trustworthy" feel while the sans body keeps it modern. Nothing on the site looks templated.

- 🔴 **No real photography.** *Why it matters:* a church's brand is fundamentally its people and its place; visual identity for a congregation cannot be carried by type and color alone. *Impact:* the placeholder tiles (striped "Your photo here" blocks, the solid-color hero, the "Pastor photo" slot) make an otherwise premium site feel like a demo, undermining trust and warmth at the exact moments they matter most. *Priority:* Critical for launch. Needs, at minimum, a real hero image, one genuine community/congregation photo, and a real photo of Pastor Mike.
- 🟡 **Trust signals are thin beyond design.** *Why:* trust for a local church comes from proof it's real and active — faces, a phone number, evidence of recent gatherings. *Impact:* the site currently proves legitimacy mainly through polish and a correct address; adding real photos, a phone number, and (honestly gathered) member quotes would materially raise perceived trustworthiness. *Priority:* Important.
- 🟢 **Professionalism is high but could be reinforced** with consistent OG imagery and a small "United Methodist Church" descriptor near the top of the Home hero (denominational clarity helps the right people self-identify). *Priority:* Enhancement.

---

## UI Design

**Strengths.** Layout, spacing, and visual hierarchy are handled at a senior level. Section rhythm alternates dark/ivory/beige intentionally; the eyebrow → headline → lede → CTA pattern is consistent and legible; cards, the service-row list, and the info bar are clean and well-aligned. The refined gold "Visit Us" nav CTA reads clearly as the primary action. Button system is coherent (gold, dark, outline, light variants).

- 🟡 **Icon vocabulary is minimal/placeholder.** *Why:* the site leans on one decorative asterisk glyph (✳) for photo slots and lacks small functional icons (map pin, clock, play, social glyphs). *Impact:* social links are text-only, and service info would scan faster with lightweight icons. *Priority:* Important (light touch — don't over-iconify the editorial aesthetic).
- 🟡 **Empty/placeholder states are visible to the public.** *Why:* the striped "photo here" tiles and "coming soon" panels are internal placeholders that are currently live. *Impact:* they read as unfinished. *Priority:* Important — replace with real content or gracefully hide until ready.
- 🟢 **Card hover/elevation is desktop-only polish** that mobile users never see; consider subtle press states on touch. *Priority:* Enhancement.
- 🟢 **Responsiveness of the design system is otherwise strong** — the split layouts, grids, and info bar collapse cleanly to a single column. *Priority:* Enhancement (already good).

---

## UX

**Strengths.** Navigation is minimal and correct (About, Watch Live, Events, Give, Visit Us), the logo-as-home pattern is clean, and the primary CTA ("Plan Your Visit" / "Visit Us") is repeated at sensible points. Service times and location are surfaced early and repeatedly (hero info bar, Events, footer). The address is tappable and opens the right maps app per device — a genuinely thoughtful detail.

- 🔴 **Mobile menu failure (live).** *Why:* the header's blur effect constrains the fixed menu overlay to the header's height, so on the live site the menu items appear stacked inside the top bar while the hero shows through. *Impact:* on phones — where the majority of church-site visitors are — the primary navigation is effectively unusable and looks broken. *Priority:* Critical. (A corrected version is already staged; it must be deployed and verified on a real device.)
- 🔴 **"Plan Your Visit" leads to a dead end (live).** *Why:* the top CTA routes to the Contact form, which currently cannot send. *Impact:* the single most important conversion path on a church site — a first-timer trying to reach out — fails silently with an error. *Priority:* Critical.
- 🟡 **"Plan Your Visit" sets no expectations.** *Why:* first-time church visitors have practical anxieties (Where do I park? What do I wear? How long is the service? Is there anything for kids? Is it accessible?). *Impact:* the CTA promises "plan your visit" but delivers only a contact form; adding an honest, factual "What to expect" block (real logistics from the church — not invented programs) would convert far better. *Priority:* Important.
- 🟡 **"Every other Saturday" is ambiguous.** *Why:* visitors can't tell *which* Saturday Bible Study/Basketball falls on. *Impact:* someone motivated to attend can't act without extra effort. The Events page's "confirm on Facebook" line partly mitigates this, but a concrete next date or a simple schedule note would remove the friction. *Priority:* Important.
- 🟢 **No visible phone number anywhere.** *Why:* an older church demographic often prefers to call. *Impact:* removes a low-effort contact path. If the church wants a public number, add a tappable `tel:` link. *Priority:* Enhancement (church's discretion).
- 🟢 **Content is JS-dependent for reveal animations** (see Technical) — a UX robustness concern for slow connections. *Priority:* Enhancement.

---

## Technical

**Strengths.** Clean, hand-written static HTML/CSS/JS with a sensible centralized settings object; one h1 per page; `lang="en"`; sensible titles and meta descriptions; `prefers-reduced-motion` respected; `rel="noopener"` on external links; HTTPS + CDN via Vercel; device-aware maps; a properly built serverless contact endpoint with honeypot + validation and Reply-To handling. Performance should be excellent (tiny payload, no framework).

- 🔴 **Contact form not connected (live).** *Why:* the front-end posts to `/api/contact`, but the mail provider environment variables aren't set, so the function returns "not connected" and the visitor sees an error. *Impact:* no messages are delivered. *Priority:* Critical.
- 🔴 **Mobile menu overlay bug (live)** — see UX. Root cause is a `backdrop-filter` containing-block interaction; fix staged. *Priority:* Critical.
- 🔴 **Dead social links.** *Why:* Instagram/TikTok use placeholder URLs that resolve to the platforms' homepages. *Impact:* clicking them looks broken and erodes trust; better to hide until real profiles exist (the config already supports hiding empty links). *Priority:* Critical (either set real URLs or hide).
- 🟡 **Content depends on JavaScript to be visible.** *Why:* elements marked for scroll-reveal start at `opacity: 0` and are shown by script; service times, the livestream block, the map, and social hrefs are all injected by JS. *Impact:* if JS fails or is slow/blocked, key content (including hero copy) can render blank. *Impact on SEO/robustness is real.* *Priority:* Important — ensure a no-JS fallback (e.g., content visible by default, enhanced by JS) at least for hero text and service times.
- 🟡 **No social-sharing / Open Graph / Twitter Card metadata.** *Why:* the church's primary distribution is Facebook; shared links currently generate no image/title/description card. *Impact:* links look bare and get fewer clicks. *Priority:* Important (borderline Critical for a socially-distributed church site).
- 🟡 **No structured data (JSON-LD).** *Why:* a `Church`/`LocalBusiness` schema with name, address, geo, and service schedule helps Google show worship times and a rich local listing. *Impact:* missed local-SEO opportunity that's tailor-made for a church. *Priority:* Important.
- 🟡 **No sitemap.xml or robots.txt.** *Why:* standard crawl/index hygiene. *Impact:* slower, less reliable indexing. *Priority:* Important (quick win).
- 🟡 **Accessibility gaps in the mobile menu.** *Why:* when open, focus isn't trapped in the overlay and `Escape` doesn't close it. *Impact:* keyboard/screen-reader users can tab "behind" the menu. *Priority:* Important.
- 🟢 **Color contrast on gold text.** *Why:* muted gold (~#b08d49) on white/beige for body-size links (e.g., "Get directions," inline links) is around 3.5:1, below WCAG AA (4.5:1) for normal text. Gold on charcoal is fine. *Impact:* harder to read for low-vision users. *Priority:* Enhancement→Important (darken gold for small text, or reserve gold for large text/backgrounds).
- 🟢 **Favicon is the full logo PNG.** *Why:* a large, detailed logo doesn't render crisply at 16–32px and adds a little weight. *Impact:* minor. *Priority:* Enhancement (add a simplified/emblem-only favicon set).
- 🟢 **Google Fonts are render-blocking.** *Why:* two families loaded from Google. *Impact:* small first-paint delay. *Priority:* Enhancement (preload or self-host).
- 🟢 **No analytics / Search Console.** *Why:* you can't improve what you can't measure. *Impact:* no visibility into traffic or search performance. *Priority:* Enhancement.
- 🟢 **Embedded content:** the Contact map embed is solid (lazy-loaded, titled). The Watch page currently shows a clean "coming soon" player-shaped placeholder — good pattern; just verify the real YouTube embed when added. *Priority:* Enhancement.

---

## Church-Specific Experience

- **Warmth (copy):** Strong. "You Belong Here," "A place to start again," "Come as you are. No pressure. No expectations." This is exactly right for a small, welcoming congregation.
- **Warmth (visual):** Undercut by the lack of real people. 🔴 Real photos of the congregation and pastor are the single biggest lever to make the site *feel* as warm as it *reads*.
- **Welcoming to newcomers:** Good tone, but thin on practical reassurance for first-timers (see "What to expect," Important).
- **Encourages attendance:** Yes — clear, repeated CTAs and service times.
- **Service times & location:** Communicated clearly and repeatedly; the tappable, device-aware address is excellent. 🟡 The "every other Saturday" ambiguity is the one weak spot.
- **Makes online worship easy:** Not yet — Watch Live is an honest placeholder. Acceptable if the church isn't streaming, but it currently promises "streams live Sundays at 10:15" while showing "coming soon," a small mismatch to reconcile. 🟡
- **Establishes trust:** Partially. Real address, UMC identity, and cohesive design help; placeholders, dead social links, a non-working form, and no faces/phone hold it back. 🟡/🔴

---

## Conversion (CRO)

The scaffolding is strong — clear primary CTA, repeated at the right moments, with good visual priority. But on the **live** site several conversion paths currently dead-end:

- **Plan a visit / contact the church:** 🔴 CTA is prominent but the destination form doesn't send. This is the highest-value action and it's broken.
- **Attend a service:** 🟢 Times/location are clear and repeated — this path works well.
- **Watch online:** 🟡 Not possible yet (placeholder); Facebook is offered as backup, which is the right fallback.
- **Give financially:** 🟡 "Coming soon" — no giving path is live. For many churches, online giving is a core function; honest short-term, but it should be prioritized.
- **Follow on social:** 🔴/🟡 Facebook works; Instagram/TikTok dead-end. Mixed result that reads as broken.
- **CRO enhancements:** 🟢 Add a single, unmissable "Plan Your Visit" moment above the fold with a one-line reassurance ("No sign-up. Just show up. We'll save you a seat."). 🟢 Consider a sticky mobile "Plan Your Visit" button once the menu is fixed.

---

## Page-by-page notes

**Home** — Strongest page. Hero + info bar + welcome + times + about teaser + closing CTA is a well-sequenced funnel. Blocked by: placeholder hero (no photo), broken mobile menu, community photo placeholder, and the downstream form/social issues. 🔴 imagery, 🔴 mobile menu.

**About** — Warm, well-written story; Pastor Mike Peery / Lay Pastor section is a great addition. Blocked by the placeholder pastor photo (🔴 — a real face here is high-impact) and the placeholder community photo. Consider one honest paragraph of church history/UMC context if available (🟢, only if factual).

**Watch Live** — Clean "coming soon" player placeholder with a Facebook backup — good pattern. 🟡 Reconcile the confident "streams live Sundays at 10:15 AM" copy with the "coming soon" state so it doesn't over-promise. Verify the real embed when available.

**Events** — Accurate and honest (Worship, Bible Study, Basketball). 🟡 "Every other Saturday" needs a concrete anchor (next date or clearer schedule). The "confirm on Facebook" line is a good mitigation. No invented programs — appropriately restrained.

**Give** — Honest "online giving coming soon" with in-person guidance. 🟡 Prioritize a real PayPal (or similar) link; giving is a core function and the page is otherwise ready to switch on.

**Contact** — Best-structured page: visit details, tappable address, a proper form (Name/Email/Phone/Message + prayer-request), and an embedded map. 🔴 The form doesn't deliver on live. 🟡 The "Follow Us" row includes the dead IG/TikTok links.

---

## Consolidated action plan (by priority)

**🔴 Critical — before launch**
1. Deploy and device-verify the mobile-menu fix (full-screen overlay).
2. Connect the contact form to a working mail service so submissions actually deliver; test a real send + reply.
3. Fix social links — set real Instagram/TikTok URLs or hide them until they exist.
4. Add real photography — hero, one community photo, and a real photo of Pastor Mike (replace all placeholder tiles).
5. Add Open Graph/Twitter meta (title, description, and a share image) so shared links render properly.

**🟡 Important — should improve**
6. Add JSON-LD `Church`/`LocalBusiness` structured data (name, address, geo, service schedule).
7. Add sitemap.xml + robots.txt.
8. Provide a no-JS fallback so hero copy and service times are visible without JavaScript.
9. Add a factual "What to expect" block to the visit flow (parking, timing, kids, accessibility — from the church).
10. Resolve "every other Saturday" ambiguity with a concrete date/schedule.
11. Reconcile Watch Live copy vs. its "coming soon" state.
12. Trap focus + enable Escape-to-close in the mobile menu.
13. Turn on online giving (real PayPal/Give link).

**🟢 Enhancements**
14. Darken gold for small text to meet AA contrast; add a phone number (tappable) if desired.
15. Add lightweight functional icons (map pin, clock, play, social glyphs).
16. Dedicated favicon set; preload/self-host fonts; add analytics + Search Console.
17. Sticky mobile "Plan Your Visit" CTA; a one-line reassurance above the fold.
18. Honest member quotes/testimonials once gathered.

---

## Scorecard

| Dimension | Score | One-line rationale |
|---|---:|---|
| **Overall** | **71 / 100** | Excellent design foundation held back by critical live-functionality and imagery gaps. |
| Design (UI craft) | 86 / 100 | Senior-level system, type, spacing, consistency; docked for placeholder imagery. |
| UX | 72 / 100 | Clean IA and CTAs, but broken mobile menu and dead-end primary actions on live. |
| Branding | 80 / 100 | Cohesive, professional identity; missing real people and dead social links limit trust. |
| Mobile | 55 / 100 | Responsive layout is good, but the primary mobile navigation is currently broken. |
| Accessibility | 68 / 100 | Good semantics/aria/reduced-motion; gaps in JS-dependency, contrast, menu focus. |
| Church experience | 70 / 100 | Warm copy and clear times/location; undercut by no faces, no phone, thin first-timer info. |
| Conversion | 62 / 100 | Strong CTA scaffolding, multiple broken conversion paths on the live site. |
| **Launch readiness** | **48 / 100** | Several 🔴 blockers make it not launchable as-is, but all are well-defined and quick to fix. |

---

## Final verdict

**"If this website belonged to one of your agency clients, would you launch it today?"**

**No — not today.** As a senior team we would not put our name on this live URL in its current state, for four concrete reasons, none of them about taste: the **mobile navigation is broken** (and most of the audience is on phones), the **contact form silently fails to deliver**, the **Instagram/TikTok links dead-end**, and there is **no real photography** on a site whose entire purpose is human warmth. Any one of those would be an embarrassing "your new site is broken" call from the client; together they make it a no-go.

**But the reason we're confident, not discouraged:** the hard part is already done and done well. The design system, information architecture, copy strategy, performance, and technical scaffolding are all at or above the standard we'd expect from a professional build. The blockers are a short, unambiguous punch-list — largely "add real photos, connect the form, fix the menu, correct two links, add share metadata." That's days of work, not weeks. Clear that list and this becomes one of the better small-church sites in its class, and we'd launch it with confidence.
