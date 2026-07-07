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

  // --- Contact email ---
  // PUBLIC church email (safe to show on the site). Do NOT put the pastor's
  // personal email here. Set this address up for FREE with Cloudflare Email
  // Routing and forward it to the pastor's real inbox. See README ("Email").
  churchEmail: "info@lambuthmemorialumc.com",

  // --- Contact form (Formspree) ---
  // Free contact-form service. Create a form at https://formspree.io, then paste
  // your endpoint here (looks like "https://formspree.io/f/abcdwxyz").
  // While this is left as the placeholder below, the form falls back to opening
  // the visitor's email app addressed to churchEmail — so it still works.
  formEndpoint: "https://formspree.io/f/your-form-id",

  // --- Social links ---
  // Facebook is real. Instagram + TikTok are PLACEHOLDERS — replace the URLs
  // below with the church's real profile links when ready. Leave any of them ""
  // (empty) to hide that icon/link everywhere it appears.
  facebookUrl: "https://www.facebook.com/LambuthMemorialChurch",
  instagramUrl: "https://www.instagram.com/", // TODO: replace with real profile URL
  tiktokUrl: "https://www.tiktok.com/", // TODO: replace with real profile URL

  // Online giving via PayPal (no monthly fee — only per-transaction fees).
  // Create a PayPal "Donate" button/link and paste the URL here, e.g.
  // "https://www.paypal.com/donate/?hosted_button_id=XXXXXXXX".
  // Leave "" empty to show a friendly "coming soon" message instead.
  donationUrl: "",

  // --- Livestream (YouTube Live) ---
  // Workflow: OBS  ->  YouTube Live  ->  embedded here on the website.
  // Paste a YouTube EMBED url. Two easy options:
  //   1) A specific stream:  "https://www.youtube.com/embed/VIDEO_ID"
  //   2) Always-current live stream for your channel:
  //      "https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID"
  // Leave "" empty to show a styled "stream will appear here" placeholder.
  livestreamEmbedUrl: "",

  // Google Maps embed src for the address above.
  // To update: Google Maps -> Share -> Embed a map -> copy the src="..." URL only.
  mapsEmbedUrl:
    "https://www.google.com/maps?q=160+Campbell+St,+Jackson,+TN+38301&output=embed",

  // Plain map link (opens directions in a new tab).
  mapsLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=160+Campbell+St,+Jackson,+TN+38301",

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

  function isPlaceholderEndpoint(url) {
    var u = (url || "").trim();
    return u === "" || /your-form-id|xxxx|FORM_ID/i.test(u);
  }

  function applySettings() {
    setText('[data-site="name"]', SITE.churchName);
    setText('[data-site="name-short"]', SITE.churchNameShort);
    setText('[data-site="address"]', SITE.address);
    setText('[data-site="tagline"]', SITE.tagline);

    // Church email links + text
    document.querySelectorAll('[data-site="email"]').forEach(function (el) {
      el.textContent = SITE.churchEmail;
      if (el.tagName === "A") el.setAttribute("href", "mailto:" + SITE.churchEmail);
    });

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

  function applyDonation() {
    var hasDonation = SITE.donationUrl && SITE.donationUrl.trim() !== "";

    document.querySelectorAll('[data-site="donate"]').forEach(function (el) {
      if (hasDonation) {
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
      el.style.display = hasDonation ? "" : "none";
    });
    document.querySelectorAll('[data-site="donate-pending"]').forEach(function (el) {
      el.style.display = hasDonation ? "none" : "";
    });
  }

  function applyLivestream() {
    var hasStream =
      SITE.livestreamEmbedUrl && SITE.livestreamEmbedUrl.trim() !== "";

    document.querySelectorAll('[data-site="livestream"]').forEach(function (container) {
      if (hasStream) {
        container.innerHTML =
          '<div class="video-frame"><iframe src="' +
          SITE.livestreamEmbedUrl +
          '" title="Live worship service" frameborder="0" ' +
          'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
          'allowfullscreen></iframe></div>';
      } else {
        // 16:9 "coming soon" area shaped like the real player, with Facebook as
        // a small backup BELOW it (never the main action).
        container.innerHTML =
          '<div class="video-frame video-frame--empty">' +
          '<div class="video-empty">' +
          '<span class="video-placeholder__eyebrow">Live Worship</span>' +
          '<p class="video-placeholder__title">Livestream coming soon</p>' +
          '<p class="video-placeholder__text">Our service will play right here each ' +
          'Sunday at 10:15 AM.</p>' +
          "</div></div>" +
          '<div class="watch-backup">' +
          '<span class="watch-backup__label">Can&rsquo;t see the stream?</span>' +
          '<a class="btn btn--outline-light btn--sm" data-site="facebook" ' +
          'href="' + SITE.facebookUrl + '" target="_blank" rel="noopener">Watch on Facebook</a>' +
          "</div>";
        container.querySelectorAll('[data-site="facebook"]').forEach(function (el) {
          el.setAttribute("href", SITE.facebookUrl);
        });
      }
    });
  }

  /** Contact form: submit to Formspree if configured, otherwise mailto fallback. */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    if (!isPlaceholderEndpoint(SITE.formEndpoint)) {
      // Formspree is configured — let the browser POST to it natively.
      form.setAttribute("action", SITE.formEndpoint.trim());
      form.setAttribute("method", "POST");
      var subj = form.querySelector('input[name="_subject"]');
      if (subj) subj.value = "New message from the church website";
      return;
    }

    // Fallback: build a mailto to the church email so the form works right away.
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var name = val("name"), email = val("email"),
        phone = val("phone"), message = val("message");
      var prayerEl = document.getElementById("prayer");
      var isPrayer = prayerEl && prayerEl.checked;

      var subject = (isPrayer ? "Prayer request" : "Website message") +
        (name ? " from " + name : "");
      var lines = [
        "Name: " + name,
        "Email: " + email,
        phone ? "Phone: " + phone : null,
        isPrayer ? "Prayer request: Yes" : null,
        "",
        message,
      ].filter(function (x) { return x !== null; });

      window.location.href = "mailto:" + SITE.churchEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
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
    initContactForm();
    initNav();
    initHeaderScroll();
    initReveal();
  });
})();
