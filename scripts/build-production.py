#!/usr/bin/env python3
"""Build antonvert.com from the existing Anton Vert staging website.

IMPORTANT: the source index.html and robots.txt remain staging-safe (noindex).
This script produces an indexable *separate* production distribution.
"""
from pathlib import Path
import shutil
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "dist-production"

source = (ROOT / "index.html").read_text(encoding="utf-8")
old_robots = '<meta name="robots" content="noindex,nofollow,noarchive">'
new_robots = '<meta name="robots" content="index,follow,max-image-preview:large">'
if source.count(old_robots) != 1:
    raise RuntimeError("Expected exactly one staging noindex meta tag; refusing production build")
if '<link rel="canonical" href="https://antonvert.com/">' not in source:
    raise RuntimeError("Production canonical URL is missing")
if source.count("G-LFD43SGSP2") != 1:
    raise RuntimeError("GA4 ID must appear exactly once")
if source.count('https://antonvert.com/assets/og-antonvert-1200x630.png') != 2:
    raise RuntimeError("Open Graph and Twitter images are missing or duplicated")
if "antonvert_analytics_consent_v1" not in source:
    raise RuntimeError("Analytics consent gate is missing")
if source.count('class="book-card"') != 3:
    raise RuntimeError("Book list changed unexpectedly")
if "«Энергия мерча»" not in source:
    raise RuntimeError("Correct book title missing")

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)
shutil.copytree(ROOT / "assets", OUT / "assets")
for name in ("favicon.svg", "_headers", "404.html"):
    shutil.copy2(ROOT / name, OUT / name)

production_html = source.replace(old_robots, new_robots)
production_html = production_html.replace(
    '<link rel="canonical" href="https://antonvert.com/">',
    '<link rel="canonical" href="https://antonvert.com/">\n'
    '  <link rel="sitemap" type="application/xml" href="/sitemap.xml">'
)
(OUT / "index.html").write_text(production_html, encoding="utf-8")
(OUT / "robots.txt").write_text(
    "User-agent: *\nAllow: /\nSitemap: https://antonvert.com/sitemap.xml\n",
    encoding="utf-8",
)
sitemap = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    '  <url><loc>https://antonvert.com/</loc><lastmod>2026-10-08</lastmod></url>\n'
    '</urlset>\n'
)
(OUT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
ET.fromstring(sitemap)

assert new_robots in production_html and old_robots not in production_html
assert 'Disallow: /' in (ROOT / "robots.txt").read_text(encoding="utf-8")
assert (ROOT / "assets" / "og-antonvert-1200x630.png").exists()
assert 'name="robots" content="noindex,nofollow"' in (OUT / "404.html").read_text(encoding="utf-8")
print("PASS production build: indexable, correct canonical, consent-gated GA4 and books")
print("PASS separate staging: source robots.txt still blocks crawling")
print("PASS generated robots.txt, sitemap.xml, 404 page, social image, favicon and assets")
print("Output: dist-production")
