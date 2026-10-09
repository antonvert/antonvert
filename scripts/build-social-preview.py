#!/usr/bin/env python3
"""Rebuild the Open Graph picture without the outdated lead-generation slogan.

Uses the existing approved right-side portrait and top/bottom branding.
Generated asset is placed in the deployment bundle, leaving source files intact.
"""
from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "og-antonvert-1200x630.png"
LINES = (
    "Помогаю основателям",
    "выстраивать B2B-продажи",
    "через личные коммуникации",
    "и публичность",
)
FONT_PATHS = (
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSerif-Regular.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
)


def render(destination: Path) -> None:
    font_path = next((p for p in FONT_PATHS if Path(p).exists()), None)
    if font_path is None:
        raise RuntimeError("Cyrillic serif font unavailable for OG preview")

    with Image.open(SOURCE) as picture:
        banner = picture.convert("RGB")

    if banner.size != (1200, 630):
        raise RuntimeError(f"Unexpected social image dimensions: {banner.size}")

    # Remove only the outdated headline on the left. Keep the photo, label,
    # blue stripe, and supporting tagline that are part of the approved image.
    draw = ImageDraw.Draw(banner)
    for y in range(166, 411):
        bg = banner.getpixel((744, y))
        draw.line((64, y, 777, y), fill=bg)

    left, top, max_width, max_bottom = 72, 175, 686, 401
    for font_size in range(51, 34, -1):
        font = ImageFont.truetype(font_path, font_size)
        line_height = font_size + 9
        widths = [draw.textbbox((0, 0), line, font=font, anchor="lt")[2] for line in LINES]
        bottom = top + 3 * line_height + font_size
        if max(widths) <= max_width and bottom <= max_bottom:
            break
    else:
        raise RuntimeError("New OG headline does not fit")

    for i, line in enumerate(LINES):
        draw.text(
            (left, top + i * line_height),
            line,
            font=font,
            fill="#192334",
            anchor="lt",
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    banner.save(destination, "PNG", optimize=True)
    with Image.open(destination) as result:
        result.verify()
    print(f"PASS: updated social preview {destination} (1200x630; {font_size}px text)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: build-social-preview.py <output-png>")
    render(Path(sys.argv[1]))
