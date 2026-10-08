# Anton Vert - launch report (2026-10-08)

## Launch status

- [x] Production source is on `main` at commit `259fb08`.
- [x] GitHub Actions production and preview deployments completed successfully.
- [x] Cloudflare Pages production project: `antonvert-live`.
- [x] Production fallback URL: <https://antonvert-live.pages.dev/>.
- [x] Staging URL: <https://antonvert-preview.pages.dev/>.
- [x] Custom domain <https://antonvert.com/> is `Active` with SSL enabled.
- [x] HTTP redirects to HTTPS; production HTTPS returns `200` without error 525.
- [x] `www.antonvert.com` permanently redirects to the apex domain with path and query string preserved.
- [x] The old `vert.expert` redirect is no longer active for `antonvert.com`.

## DNS changes

- [x] Removed only the two obsolete apex A records: `3.33.251.168` and `15.197.225.128`.
- [x] Added proxied CNAME `@` -> `antonvert-live.pages.dev` with TTL Auto.
- [x] Added proxied CNAME `www` -> `antonvert-live.pages.dev` with TTL Auto.
- [x] Added one active Cloudflare Redirect Rule: hostname `www.antonvert.com` -> `https://antonvert.com` with status `301`, preserving path and query string.
- [x] MX, TXT, `_domainconnect`, `pay.antonvert.com`, SPF and DMARC records were left unchanged.
- [x] Exported a pre-cutover DNS backup before changes.

## Production quality checks

- [x] Responsive QA passed at 1440, 1024, 768, 390 and 360 px with no horizontal overflow.
- [x] Mobile navigation opens and closes correctly.
- [x] All internal anchors resolve and all six content images load successfully.
- [x] Hero, book covers and neutral image backgrounds were visually reviewed on production.
- [x] Contact CTAs, Telegram, email, LinkedIn, YouTube, SWAGGY, vertcomm and book links were checked.
- [x] Browser console has no errors on the production domain.
- [x] Favicon, canonical URL, Open Graph and Twitter metadata are deployed.
- [x] Social image `assets/og-antonvert-1200x630.png` is deployed at exactly 1200 x 630 px.

## SEO and indexing

- [x] Production uses canonical `https://antonvert.com/` and `index,follow`.
- [x] Production `robots.txt` allows crawling and points to the sitemap.
- [x] Production `sitemap.xml` contains the canonical homepage.
- [x] Staging remains protected with `noindex,nofollow,noarchive` and `Disallow: /`.
- [ ] Search Console: the signed-in Google account does not have access to the `antonvert.com` property. No TXT records were changed; an owner must grant access or complete verification and submit `https://antonvert.com/sitemap.xml`.

## Analytics and privacy

- [x] GA4 web stream is configured for `https://antonvert.com` with measurement ID `G-LFD43SGSP2`.
- [x] Google Analytics does not load before explicit consent.
- [x] Accept and decline choices persist; analytics settings can be reopened from the footer.
- [x] After consent, exactly one GA4 tag loads; CTA/contact/project/social/book click events are instrumented.
- [ ] GA4 reporting UI still shows no traffic for the previous 48 hours immediately after launch. Recheck once Google processes the first consented production events.

## Remaining owner follow-up

- [ ] Provide the booking URL for the 20-minute intro (Calendly or equivalent). Until then, the intro action opens a pre-addressed email draft and clearly explains that calendar booking is being connected.
- [ ] Grant Search Console access or verify the property, then submit the sitemap.
- [ ] Confirm the first production events in GA4 after processing.

## Links

- Production: <https://antonvert.com/>
- Production fallback: <https://antonvert-live.pages.dev/>
- Staging: <https://antonvert-preview.pages.dev/>
- Repository: <https://github.com/kirillgoncharik-commits/antonvert>
