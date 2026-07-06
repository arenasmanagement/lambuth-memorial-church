PUT YOUR REAL CHURCH PHOTOS HERE
================================

This folder holds images used by the website. Drop your own photos in
here (no AI-generated images), then reference them in the HTML/CSS.

Suggested files to add:
  hero.jpg        - Wide, high-quality photo for the homepage hero background.
  community.jpg   - A photo of your congregation for the homepage "Our Heart" section.
  favicon.png     - Small square icon shown in the browser tab (optional).

How to use them:
  1. Save your photo into this assets/ folder.
  2. Homepage hero: open index.html, find the commented <img> line inside
     <div class="hero__media"> and uncomment it, e.g.:
        <img src="assets/hero.jpg" alt="Lambuth Memorial Church" />
  3. "Our Heart" photo: in index.html, replace the <div class="photo-slot">...</div>
     block with:
        <img src="assets/community.jpg" alt="Our church community" />

Tips:
  - Use JPG for photos, PNG for logos/icons.
  - Keep files reasonably sized (under ~500 KB each) so the site loads fast.
  - File names are case-sensitive on the web: assets/Hero.JPG is NOT assets/hero.jpg.
