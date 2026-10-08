# Anton Vert - pre-launch checklist (2026-10-08)

## Implemented in this branch
- [x] Editorial route: hero, usefulness, experience, approach, books, formats, contact.
- [x] Updated supplied copy, factual numbers, and SWAGGY/vertcomm cases.
- [x] Neutral framed hero built to work as a social-post screenshot.
- [x] White two-line Anton Vert icon in header and favicon.svg.
- [x] Three books, correctly titled "Энергия мерча", with new photo on neutral background.
- [x] Updated three format descriptions, contact actions, and LinkedIn/YouTube/vert.expert footer.
- [x] GA4 ID G-LFD43SGSP2 installed in index.html.
- [x] Cloudflare preview workflow packages favicon.svg.

## Blockers before final release
- [ ] **Anton:** give the booking URL for a **20-minute intro** (Calendly or equivalent).
  Until provided, the primary "intro" action opens a clearly described email draft.
- [ ] **Visual approval:** check hero at 1440px, 1024px, 768px, 390px and 360px, including post screenshot.
- [ ] **Books:** inspect the apparent grey/background consistency of all three book images at the deployed preview.
- [ ] **Social image:** export an approved 1200x630 hero-style OG image from a clean screenshot, then set og:image and twitter:image.
- [ ] **Analytics:** verify the real-time GA4 report, click tracking, and EU cookie / privacy treatment.

## Production cutover - antonvert.com
1. Attach `antonvert.com` to the selected Cloudflare Pages project; configure apex and decide whether `www` redirects to apex. DNS registration alone does not publish the site.
2. Resolve the staging-vs-production indexing strategy. Staging currently has meta robots `noindex,nofollow,noarchive` and `robots.txt` with `Disallow: /`; **do not launch on that configuration**.
3. For production, allow indexing, update `robots.txt`, publish a sitemap, and retain `https://antonvert.com/` as the only canonical URL.
4. Ensure correct 301 redirect from `www.antonvert.com` to `antonvert.com` (if chosen), valid HTTPS and the favicon.
5. Recheck all links / CTAs / 404 / mobile navigation / header logo on the actual custom domain.
6. Connect the verified Search Console property, submit the sitemap and monitor indexing.
7. Once approved, take the first-screen screenshot for Anton's social post and confirm the social preview.
8. Keep stage/review builds separate from the indexable public domain.

Current preview: https://antonvert-preview.pages.dev/
Repo: https://github.com/kirillgoncharik-commits/antonvert
