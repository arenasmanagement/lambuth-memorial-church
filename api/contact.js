/* ============================================================
   /api/contact  —  Vercel Serverless Function
   ------------------------------------------------------------
   Receives the contact-form POST and sends it to the church
   inbox using Resend. The visitor's email becomes Reply-To, so
   Pastor Mike can just hit "Reply" in Gmail.

   This is the same architecture as the Arenas Management Co.
   site (Resend), adapted to a dependency-free function so it
   runs on a static site with no build step.

   ENVIRONMENT VARIABLES (set in Vercel → Settings → Environment
   Variables — never commit these):
     RESEND_API_KEY   Resend API key (secret, starts "re_"). Use a key created
                      specifically for THIS site — do not reuse another site's key.
     CONTACT_EMAIL    primary recipient — Pastor Mike's inbox (the "To").
     BCC_EMAIL        optional blind-copy recipient (e.g. the agency inbox). Leave
                      unset to send with no BCC.
     FROM_EMAIL       verified sender. Until the domain is verified in Resend, use
                      "Lambuth Memorial <onboarding@resend.dev>". After verifying
                      lambuthmemorialumc.com, set it to
                      "Lambuth Memorial <contact@lambuthmemorialumc.com>".

   These live in THIS Vercel project only. They do not affect any other project.
   ============================================================ */

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Vercel parses JSON bodies automatically; guard just in case.
    var body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    var name = (body.name || "").toString().trim();
    var email = (body.email || "").toString().trim();
    var phone = (body.phone || "").toString().trim();
    var message = (body.message || "").toString().trim();
    var isPrayer = body.prayer_request === "Yes" || body.prayer_request === true;
    var gotcha = (body._gotcha || "").toString().trim();

    // Honeypot: real people leave this empty; bots fill it. Pretend success.
    if (gotcha) return res.status(200).json({ success: true });

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Please fill in your name, email, and message." });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (message.length > 5000) {
      return res.status(400).json({ error: "Message is too long." });
    }

    var apiKey = process.env.RESEND_API_KEY;
    var to = process.env.CONTACT_EMAIL;
    var bcc = (process.env.BCC_EMAIL || "").trim();
    var from = process.env.FROM_EMAIL || "Lambuth Memorial <onboarding@resend.dev>";
    if (!apiKey || !to) {
      // Not configured yet — front-end will show a friendly error.
      return res.status(503).json({ error: "The contact form isn’t connected yet." });
    }

    var subject = "New message from Lambuth Memorial website";
    var html =
      '<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;background:#1a1917;color:#ece7dd;padding:32px;border-radius:12px;">' +
        '<div style="border-bottom:1px solid #33302b;padding-bottom:20px;margin-bottom:20px;">' +
          '<p style="color:#c8a86b;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 8px;">Lambuth Memorial — Website Message</p>' +
          '<h1 style="font-size:22px;margin:0;color:#faf7f1;">' + (isPrayer ? "Prayer request" : "New message") + " from " + escapeHtml(name) + "</h1>" +
        "</div>" +
        '<table style="width:100%;border-collapse:collapse;">' +
          '<tr><td style="padding:6px 0;color:#a7a094;font-size:13px;width:110px;">Name</td><td style="padding:6px 0;color:#ece7dd;font-size:13px;">' + escapeHtml(name) + "</td></tr>" +
          '<tr><td style="padding:6px 0;color:#a7a094;font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;"><a href="mailto:' + escapeHtml(email) + '" style="color:#c8a86b;">' + escapeHtml(email) + "</a></td></tr>" +
          (phone ? '<tr><td style="padding:6px 0;color:#a7a094;font-size:13px;">Phone</td><td style="padding:6px 0;color:#ece7dd;font-size:13px;">' + escapeHtml(phone) + "</td></tr>" : "") +
          '<tr><td style="padding:6px 0;color:#a7a094;font-size:13px;">Prayer request</td><td style="padding:6px 0;color:#ece7dd;font-size:13px;">' + (isPrayer ? "Yes" : "No") + "</td></tr>" +
        "</table>" +
        '<div style="margin-top:24px;padding:20px;background:#24221f;border-radius:8px;border:1px solid #33302b;">' +
          '<p style="color:#a7a094;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">Message</p>' +
          '<p style="color:#ece7dd;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">' + escapeHtml(message) + "</p>" +
        "</div>" +
        '<div style="margin-top:24px;">' +
          '<a href="mailto:' + escapeHtml(email) + '" style="display:inline-block;background:#b08d49;color:#1a1917;font-weight:600;font-size:13px;padding:10px 20px;border-radius:6px;text-decoration:none;">Reply to ' + escapeHtml(name) + "</a>" +
        "</div>" +
        '<p style="color:#555;font-size:11px;margin-top:24px;">Sent from the contact form at lambuthmemorialumc.com</p>' +
      "</div>";

    var mail = {
      from: from,
      to: [to],
      reply_to: email, // Reply goes straight to the visitor
      subject: subject,
      html: html,
    };
    if (bcc) mail.bcc = [bcc]; // optional blind copy (e.g. agency inbox)

    var resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mail),
    });

    if (!resp.ok) {
      var detail = "";
      try { detail = await resp.text(); } catch (e) {}
      console.error("Resend error", resp.status, detail);
      return res.status(502).json({ error: "We couldn’t send your message. Please try again." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact function error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
