#!/usr/bin/env python3
"""Resize, watermark, and write large + thumb JPEGs for Pfeifer galleries."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

WATERMARK = "pfeiferbuild.com"
LARGE_EDGE = 1600
THUMB_EDGE = 800
LARGE_Q = 74
THUMB_Q = 72


def load(path: Path) -> Image.Image:
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    elif img.mode == "L":
        img = img.convert("RGB")
    return img


def fit(img: Image.Image, edge: int) -> Image.Image:
    w, h = img.size
    longest = max(w, h)
    if longest <= edge:
        return img.copy()
    scale = edge / longest
    size = (max(1, round(w * scale)), max(1, round(h * scale)))
    return img.resize(size, Image.Resampling.LANCZOS)


def font_for(width: int, height: int) -> ImageFont.ImageFont:
    size = max(14, min(width, height) // 28)
    for name in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ):
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


def watermark(img: Image.Image) -> Image.Image:
    base = img.convert("RGBA")
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font = font_for(*base.size)
    text = WATERMARK
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad = max(12, min(base.size) // 40)
    x = base.size[0] - tw - pad
    y = base.size[1] - th - pad
    # ~20% opacity white
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 52))
    return Image.alpha_composite(base, overlay).convert("RGB")


def save_jpeg(img: Image.Image, dest: Path, quality: int) -> dict:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(
        dest,
        format="JPEG",
        quality=quality,
        optimize=True,
        progressive=True,
        exif=b"",
    )
    return {
        "path": str(dest),
        "bytes": dest.stat().st_size,
        "width": img.size[0],
        "height": img.size[1],
    }


def process(src: Path, large_path: Path, thumb_path: Path) -> dict:
    original = load(src)
    large = watermark(fit(original, LARGE_EDGE))
    thumb = fit(original, THUMB_EDGE)
    return {
        "ok": True,
        "source": {"width": original.size[0], "height": original.size[1]},
        "large": save_jpeg(large, large_path, LARGE_Q),
        "thumb": save_jpeg(thumb, thumb_path, THUMB_Q),
    }


def main() -> int:
    if len(sys.argv) != 4:
        print(json.dumps({"ok": False, "error": "usage: src large.jpg thumb.jpg"}))
        return 2
    src, large, thumb = map(Path, sys.argv[1:4])
    try:
        print(json.dumps(process(src, large, thumb)))
        return 0
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
