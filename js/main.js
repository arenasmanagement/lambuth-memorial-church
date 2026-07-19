/* ============================================================
   LAMBUTH MEMORIAL UNITED METHODIST CHURCH — SITE SETTINGS
   ------------------------------------------------------------
   EDIT EVERYTHING HERE. This is the only file you need to touch
   to update contact info, links, service times, and embeds.
   After editing: save the file, then run
     git add .
     git commit -m "Update site settings"
     git push
   Vercel will redeploy automatically.
   ============================================================ */

const SITE = {
  // --- Church identity ---
  churchName: "Lambuth Memorial United Methodist Church",
  // Shorter name used on small screens where the full name is too long.
  churchNameShort: "Lambuth Memorial UMC",
  tagline: "You Belong Here",
  address: "160 Campbell St, Jackson, TN 38301",

  // --- Contact form ---
  // The form posts to our own serverless function at /api/contact, which sends
  // the message via Resend to Pastor Mike's inbox (Reply-To = the visitor).
  // The destination email + API key live in Vercel Environment Variables, never
  // in this file. You normally don't need to change this. See README -> "Contact form".
  formEndpoint: "/api/contact",

  // --- Social links ---
  // Facebook is real. Instagram + TikTok are PLACEHOLDERS — replace the URLs
  // below with the church's real profile links when ready. Leave any of them ""
  // (empty) to hide that icon/link everywhere it appears.
  facebookUrl: "https://www.facebook.com/LambuthMemorialChurch",
  instagramUrl: "https://www.instagram.com/", // TODO: replace with real profile URL
  tiktokUrl: "https://www.tiktok.com/", // TODO: replace with real profile URL

  // --- Online giving (PayPal) ---
  // The Give page builds a secure PayPal donate link that PRE-FILLS the amount the
  // visitor chose, so they never pick it twice. The site never processes payments —
  // PayPal handles the amount, payment method, and card/security.
  //   • One-Time gifts: amount pre-filled → straight to payment.
  //   • Monthly gifts:  amount pre-filled; the donor ticks "Make this a monthly
  //     donation" on PayPal's secure page (PayPal has no URL parameter to pre-tick it).
  // To turn giving OFF, set donationEnabled: false (shows a "being set up" notice).
  donationProvider: "PayPal",
  donationEnabled: true,
  paypalMerchantId: "RNMSDCJKQJP6U",          // public PayPal Merchant ID (safe to expose)
  donationCurrency: "USD",
  donationItemName: "Donation to Lambuth Memorial United Methodist Church",
  // Optional full-URL override. If set, it is used AS-IS and the amount is NOT
  // appended (only use this if you ever switch to a hosted PayPal button/page).
  donationUrl: "",

  // --- Livestream (YouTube, fully automatic) ---
  // Workflow: OBS -> Restream Standard -> YouTube + Facebook.
  // The Watch Live page shows the RIGHT thing automatically — live now, the next
  // scheduled stream, or the most recent replay — by asking our own serverless
  // endpoint /api/livestream, which reads YouTube's broadcast state via the
  // YouTube Data API. YOU NEVER PASTE A WEEKLY VIDEO ID.
  //
  // Setup lives in Vercel Environment Variables (never in this file):
  //   YOUTUBE_API_KEY      YouTube Data API v3 key (server-side secret)
  //   YOUTUBE_CHANNEL_ID   the church channel ID (starts "UC...")
  //
  // youtubeUrl below is PUBLIC and only powers the "Watch on YouTube" button.
  // Use the channel's page or its /live URL. Leave "" to hide that button.
  youtubeUrl: "https://www.youtube.com/@lambuthcommunitychurch3394",

  // Google Maps embed src for the address above.
  // To update: Google Maps -> Share -> Embed a map -> copy the src="..." URL only.
  mapsEmbedUrl:
    "https://www.google.com/maps?q=160+Campbell+St,+Jackson,+TN+38301&output=embed",

  // Plain map link (opens directions in a new tab).
  mapsLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=160+Campbell+St,+Jackson,+TN+38301",

  // --- Google Analytics 4 ---
  // Measurement ID for THIS website's own GA4 property/data stream (separate from
  // any other site). Loading the tag is handled automatically on every page.
  // Leave "" empty to disable analytics entirely. To change: paste the G-XXXXXXXXXX
  // Measurement ID from Google Analytics -> Admin -> Data Streams -> your web stream.
  gaMeasurementId: "G-DWQWG8LFTC",

  // --- Service & gathering times ---
  services: [
    { name: "Sunday Worship", day: "Every Sunday", time: "10:15 AM" },
    { name: "Bible Study", day: "Every other Saturday", time: "9:00 AM" },
    { name: "Basketball", day: "Every other Saturday", time: "10:00 AM" },
  ],
};

// Expose settings so other scripts on the page can read them.
window.SITE = SITE;

/* ============================================================
   BELOW THIS LINE: site behavior. You normally don't edit this.
   ============================================================ */

(function () {
  "use strict";

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  function applySettings() {
    setText('[data-site="name"]', SITE.churchName);
    setText('[data-site="name-short"]', SITE.churchNameShort);
    setText('[data-site="address"]', SITE.address);
    setText('[data-site="tagline"]', SITE.tagline);

    // Social links (Facebook / Instagram / TikTok). Empty URL hides the link.
    applySocial("facebook", SITE.facebookUrl);
    applySocial("instagram", SITE.instagramUrl);
    applySocial("tiktok", SITE.tiktokUrl);

    document.querySelectorAll('[data-site="maps-embed"]').forEach(function (el) {
      el.setAttribute("src", SITE.mapsEmbedUrl);
    });

    setText('[data-site="year"]', String(new Date().getFullYear()));

    applyServiceTimes();
    applyDonation();
    applyLivestream();
    applyAddressLinks();
  }

  /** Point every [data-site="<key>"] link at its URL, or hide it when empty. */
  function applySocial(key, url) {
    var has = url && url.trim() !== "";
    document.querySelectorAll('[data-site="' + key + '"]').forEach(function (el) {
      if (has) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        el.style.display = "";
      } else {
        // Only hide standalone social links, never buttons that carry other text.
        if (el.getAttribute("data-site-optional") !== "false") el.style.display = "none";
      }
    });
  }

  /** Device-aware maps: Apple Maps on iOS, default nav on Android, Google Maps on desktop. */
  function deviceMapsUrl() {
    var ua = navigator.userAgent || "";
    var isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/.test(ua);
    var q = encodeURIComponent(SITE.address);
    if (isIOS) return { url: "https://maps.apple.com/?q=" + q, newTab: false };
    if (isAndroid) return { url: "geo:0,0?q=" + q, newTab: false };
    return { url: "https://www.google.com/maps/search/?api=1&query=" + q, newTab: true };
  }

  /** Make every address + "Get directions" link open the right maps app for the device. */
  function applyAddressLinks() {
    var m = deviceMapsUrl();

    // Existing "Get directions" anchors
    document.querySelectorAll('[data-site="maps-link"]').forEach(function (a) {
      a.setAttribute("href", m.url);
      if (m.newTab) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      } else {
        a.removeAttribute("target");
      }
    });

    // Make the address text itself tappable
    document.querySelectorAll('[data-site="address"]').forEach(function (el) {
      if (el.getAttribute("data-addr-wired") === "true") return;
      el.setAttribute("data-addr-wired", "true");
      el.classList.add("addr-link");
      el.setAttribute("role", "link");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", "Open directions to " + SITE.address);
      var go = function () {
        if (m.newTab) window.open(m.url, "_blank", "noopener");
        else window.location.href = m.url;
      };
      el.addEventListener("click", go);
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
  }

  function applyServiceTimes() {
    document.querySelectorAll('[data-site="services"]').forEach(function (container) {
      container.innerHTML = "";
      SITE.services.forEach(function (s) {
        var row = document.createElement("div");
        row.className = "service-row";
        row.innerHTML =
          '<div class="service-row__name">' + s.name + "</div>" +
          '<div class="service-row__meta"><span class="service-row__day">' +
          s.day + '</span><span class="service-row__time">' + s.time + "</span></div>";
        container.appendChild(row);
      });
    });
  }

  /** Whether online giving is live: enabled AND a merchant ID (or override URL) exists. */
  function givingIsLive() {
    var hasMerchant = SITE.paypalMerchantId && SITE.paypalMerchantId.trim() !== "";
    var hasOverride = SITE.donationUrl && SITE.donationUrl.trim() !== "";
    return SITE.donationEnabled === true && (hasMerchant || hasOverride);
  }

  /**
   * Build a secure PayPal donate link with the amount + frequency pre-filled.
   * The visitor picks on our site; PayPal receives the amount already set.
   *   freq "monthly" -> no_recurring=0 (PayPal shows the "Make this monthly" tick)
   *   freq "one-time" -> no_recurring=1 (single payment)
   * A full donationUrl override, if set, is returned as-is.
   */
  function buildDonationUrl(amount, freq) {
    if (SITE.donationUrl && SITE.donationUrl.trim() !== "") return SITE.donationUrl.trim();
    if (!SITE.paypalMerchantId || SITE.paypalMerchantId.trim() === "") return "";
    var params = [
      "business=" + encodeURIComponent(SITE.paypalMerchantId.trim()),
      "currency_code=" + encodeURIComponent(SITE.donationCurrency || "USD"),
      "item_name=" + encodeURIComponent(SITE.donationItemName || "Donation"),
      "no_recurring=" + (freq === "monthly" ? "0" : "1"),
    ];
    var amt = parseFloat(amount);
    if (!isNaN(amt) && amt > 0) params.push("amount=" + amt);
    return "https://www.paypal.com/donate/?" + params.join("&");
  }

  function applyDonation() {
    var live = givingIsLive();

    // Legacy simple donate buttons/blocks (used elsewhere) still work.
    document.querySelectorAll('[data-site="donate"]').forEach(function (el) {
      if (el.closest("[data-give-widget]")) return; // handled by the widget
      if (live) {
        el.setAttribute("href", SITE.donationUrl);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        el.classList.remove("is-disabled");
      } else {
        el.setAttribute("href", "#");
        el.classList.add("is-disabled");
        el.setAttribute("aria-disabled", "true");
      }
    });
    document.querySelectorAll('[data-site="donate-ready"]').forEach(function (el) {
      el.style.display = live ? "" : "none";
    });
    document.querySelectorAll('[data-site="donate-pending"]').forEach(function (el) {
      el.style.display = live ? "none" : "";
    });

    initGiveWidget();
  }

  /**
   * Give page donation widget: frequency (one-time/monthly) + preset amounts +
   * custom amount. The site never processes payments — the Donate button simply
   * opens the configured provider URL (PayPal), which handles amount + payment.
   */
  function initGiveWidget() {
    var widget = document.querySelector("[data-give-widget]");
    if (!widget) return;

    var live = givingIsLive();
    var freqBtns = widget.querySelectorAll("[data-freq]");
    var amtBtns = widget.querySelectorAll("[data-amount]");
    var customWrap = widget.querySelector("[data-give-custom]");
    var customInput = widget.querySelector("#give-custom-amount");
    var donateBtn = widget.querySelector('[data-site="donate"]');
    var summary = widget.querySelector("[data-give-summary]");
    var monthlyNote = widget.querySelector("[data-give-monthly-note]");
    var setupMsg = widget.querySelector("[data-give-setup]");

    var state = { freq: "one-time", amount: "25", custom: "" };

    function currentAmount() {
      return state.amount === "custom" ? state.custom : state.amount;
    }

    function refresh() {
      // Reflect selection on the buttons
      freqBtns.forEach(function (b) {
        var on = b.getAttribute("data-freq") === state.freq;
        b.classList.toggle("is-selected", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      amtBtns.forEach(function (b) {
        var on = b.getAttribute("data-amount") === state.amount;
        b.classList.toggle("is-selected", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (customWrap) customWrap.hidden = state.amount !== "custom";

      var amt = currentAmount();
      var amtNum = parseFloat(amt);
      var hasAmt = !isNaN(amtNum) && amtNum > 0;
      var freqWord = state.freq === "monthly" ? "monthly gift" : "one-time gift";

      // Small confirming caption under the button
      if (summary) {
        summary.textContent = hasAmt
          ? "$" + amt + " " + freqWord
          : "You’ll choose your amount on the next screen — " + freqWord + ".";
      }
      // Monthly expectation note (amount is never chosen twice; only the tick)
      if (monthlyNote) monthlyNote.hidden = !(live && state.freq === "monthly");

      // Button (live) vs. "being set up" message
      if (live) {
        if (donateBtn) {
          donateBtn.style.display = "";
          donateBtn.setAttribute("href", buildDonationUrl(amt, state.freq));
          donateBtn.setAttribute("target", "_blank");
          donateBtn.setAttribute("rel", "noopener");
          donateBtn.classList.remove("is-disabled");
          donateBtn.removeAttribute("aria-disabled");
        }
        if (setupMsg) setupMsg.hidden = true;
      } else {
        if (donateBtn) donateBtn.style.display = "none";
        if (monthlyNote) monthlyNote.hidden = true;
        if (setupMsg) setupMsg.hidden = false;
      }
    }

    freqBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        state.freq = b.getAttribute("data-freq");
        refresh();
      });
    });
    amtBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        state.amount = b.getAttribute("data-amount");
        refresh();
        if (state.amount === "custom" && customInput) customInput.focus();
      });
    });
    if (customInput) {
      customInput.addEventListener("input", function () {
        state.custom = customInput.value.replace(/[^0-9.]/g, "");
        refresh();
      });
    }
    // The site does not process payments; just hand off to the provider.
    if (donateBtn) {
      donateBtn.addEventListener("click", function (e) {
        if (!live) { e.preventDefault(); return; }
        // href already points at SITE.donationUrl; provider handles the amount.
      });
    }

    refresh();
  }

  /* --- Watch Live -------------------------------------------------------
     The player is DRIVEN BY /api/livestream, which reports one of four
     states from the church's YouTube channel: live, upcoming, replay, none.
     We render a branded fallback FIRST (so there is never empty space or a
     layout shift), then upgrade to the real player once the lookup returns.
     Nothing here needs a weekly video ID. */

  function escAttr(s) {
    return String(s == null ? "" : s).replace(/"/g, "&quot;");
  }

  /** Balanced "Watch on YouTube / Watch on Facebook" controls (safe new-tab links). */
  function watchControls(videoId) {
    var yt = videoId
      ? "https://www.youtube.com/watch?v=" + encodeURIComponent(videoId)
      : (SITE.youtubeUrl || "").trim();
    var fb = (SITE.facebookUrl || "").trim();
    var html = '<div class="watch-actions">';
    if (yt) {
      html +=
        '<a class="btn btn--outline-light btn--sm" href="' + escAttr(yt) +
        '" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>';
    }
    if (fb) {
      html +=
        '<a class="btn btn--outline-light btn--sm" href="' + escAttr(fb) +
        '" target="_blank" rel="noopener noreferrer">Watch on Facebook</a>';
    }
    html += "</div>";
    return html;
  }

  /** 16:9 YouTube iframe (privacy-friendly nocookie host, fullscreen enabled). */
  function playerFrame(videoId, autoplayMuted) {
    var params = "rel=0&modestbranding=1&playsinline=1";
    if (autoplayMuted) params += "&autoplay=1&mute=1";
    var src = "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(videoId) + "?" + params;
    return (
      '<div class="video-frame"><iframe src="' + escAttr(src) + '" ' +
      'title="Lambuth Memorial worship service" loading="lazy" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
      "allowfullscreen></iframe></div>"
    );
  }

  /** Small status pill shown above the player (live / upcoming / replay). */
  function statusPill(kind, label) {
    return (
      '<div class="watch-status watch-status--' + kind + '">' +
      (kind === "live" ? '<span class="watch-status__dot"></span>' : "") +
      label + "</div>"
    );
  }

  /** Branded fallback shaped exactly like the real 16:9 player. */
  function fallbackMarkup() {
    return (
      '<div class="video-frame video-frame--empty">' +
        '<div class="video-empty">' +
          '<span class="video-placeholder__eyebrow">Live Worship</span>' +
          '<p class="video-placeholder__title">Sunday worship begins at 10:15 AM.</p>' +
          '<p class="video-placeholder__text">The service will appear here ' +
          "automatically when we go live. You&rsquo;re always welcome to watch " +
          "on Facebook in the meantime.</p>" +
        "</div>" +
      "</div>" +
      watchControls("")
    );
  }

  function renderLivestream(container, data) {
    data = data || { state: "none" };
    var html;

    if (data.state === "live" && data.videoId) {
      html =
        statusPill("live", "Live now") +
        playerFrame(data.videoId, true) +
        watchControls(data.videoId);
    } else if (data.state === "upcoming" && data.videoId) {
      html =
        statusPill("upcoming", upcomingLabel(data.scheduledStartTime)) +
        playerFrame(data.videoId, false) +
        watchControls(data.videoId);
    } else if (data.state === "replay" && data.videoId) {
      html =
        statusPill("replay", "Latest service · watch the replay") +
        playerFrame(data.videoId, false) +
        watchControls(data.videoId);
    } else {
      html = fallbackMarkup();
    }
    container.innerHTML = html;
  }

  /** "Upcoming · Sun 10:15 AM" from an ISO scheduled start time, when present. */
  function upcomingLabel(iso) {
    if (!iso) return "Upcoming service";
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "Upcoming service";
      var when = d.toLocaleString("en-US", {
        weekday: "short", hour: "numeric", minute: "2-digit",
      });
      return "Upcoming · " + when;
    } catch (e) {
      return "Upcoming service";
    }
  }

  /**
   * Single source of truth for livestream status. Memoized so the whole page
   * makes ONE request to /api/livestream no matter how many things need it
   * (the Watch player AND the homepage/nav live indicator share this promise).
   * The endpoint itself is edge-cached, so YouTube is not polled per visitor.
   */
  var _livestreamStatus = null;
  function getLivestreamStatus() {
    if (_livestreamStatus) return _livestreamStatus;
    if (!("fetch" in window)) {
      _livestreamStatus = Promise.resolve({ state: "none" });
      return _livestreamStatus;
    }
    _livestreamStatus = fetch("/api/livestream", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : { state: "none" }; })
      .catch(function () { return { state: "none" }; });
    return _livestreamStatus;
  }

  function applyLivestream() {
    var containers = document.querySelectorAll('[data-site="livestream"]');
    if (!containers.length) return;

    // 1) Show the branded fallback immediately — no empty space, no layout shift.
    containers.forEach(function (c) { c.innerHTML = fallbackMarkup(); });

    // 2) Ask (the shared) status what to show, then upgrade in place.
    getLivestreamStatus().then(function (data) {
      containers.forEach(function (c) { renderLivestream(c, data); });
    });
  }

  /**
   * Homepage/nav "we're live" indicator. When — and only when — a broadcast is
   * actually live, the hero CTA becomes a tasteful church-red "Live Now" and the
   * nav "Watch Live" link becomes "Live", each with a subtle pulsing dot. When
   * the stream isn't live the markup stays exactly as authored, so it restores
   * itself automatically on the next page load. Reuses the shared status above.
   */
  function applyLiveIndicators() {
    var ctas = document.querySelectorAll("[data-live-cta]");
    var navLinks = document.querySelectorAll('[data-nav] a[href="watch.html"]');
    if (!ctas.length && !navLinks.length) return;

    getLivestreamStatus().then(function (data) {
      if (!data || data.state !== "live") return; // default stays as-is

      var dot = '<span class="live-dot" aria-hidden="true"></span>';

      ctas.forEach(function (a) {
        if (a.getAttribute("data-live-on") === "true") return;
        a.setAttribute("data-live-on", "true");
        a.classList.add("btn--live");
        a.setAttribute("aria-label", "Watch our worship service — live now");
        a.innerHTML = dot + '<span class="live-cta__label">Live Now</span>';
      });

      navLinks.forEach(function (a) {
        if (a.getAttribute("data-live-on") === "true") return;
        a.setAttribute("data-live-on", "true");
        a.classList.add("nav-live");
        a.setAttribute("aria-label", "Watch Live — live now");
        a.innerHTML = dot + "Live";
      });
    });
  }

  /** Show a status message under the contact form. */
  function setFormStatus(el, type, msg) {
    if (!el) return;
    el.textContent = msg || "";
    el.className = "form__status" + (type ? " form__status--" + type : "");
    el.style.display = msg ? "" : "none";
  }

  /**
   * Contact form -> our /api/contact serverless function (which sends via Resend).
   * Submits JSON over AJAX: the visitor stays on the page and sees a success or
   * error message. Reply-To is set to the visitor server-side, so Pastor Mike can
   * just hit Reply in Gmail.
   */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = document.getElementById("form-status");
    var endpoint = (SITE.formEndpoint || "/api/contact").trim();

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var prayerBox = document.getElementById("prayer");
      var honeypot = form.querySelector('[name="_gotcha"]');
      var payload = {
        name: val("name"),
        email: val("email"),
        phone: val("phone"),
        message: val("message"),
        prayer_request: prayerBox && prayerBox.checked ? "Yes" : "No",
        _gotcha: honeypot ? honeypot.value : "",
      };

      var btn = form.querySelector('button[type="submit"]');
      var originalLabel = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      setFormStatus(status, "", "");

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            form.style.display = "none";
            setFormStatus(status, "success",
              "Thank you! Your message has been sent successfully. " +
              "Pastor Mike will get back to you as soon as possible.");
          } else {
            setFormStatus(status, "error",
              "Sorry — something went wrong and your message didn’t send. " +
              "Please try again in a moment, or reach us on Facebook.");
          }
        })
        .catch(function () {
          setFormStatus(status, "error",
            "Sorry — we couldn’t send your message. Please check your connection " +
            "and try again, or reach us on Facebook.");
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
        });
    });
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector("[data-header]");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /**
   * Load Google Analytics 4 (gtag.js) when a Measurement ID is set. Injected once
   * per page so it lives on all pages without hardcoding the tag into each HTML file.
   * Only this site's own property receives data.
   */
  function initAnalytics() {
    var id = SITE.gaMeasurementId && SITE.gaMeasurementId.trim();
    if (!id) return;
    if (document.querySelector('script[data-ga4]')) return;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    s.setAttribute("data-ga4", "true");
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id);
  }

  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(function (el) { obs.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applySettings();
    initAnalytics();
    initContactForm();
    initNav();
    initHeaderScroll();
    initReveal();
    applyLiveIndicators();
  });
})();
