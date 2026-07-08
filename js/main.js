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
