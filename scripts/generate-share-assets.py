"""Regenerate the favicon, app icons and the social share image in src/app/.

Usage:
    python3 scripts/generate-share-assets.py path/to/Fraunces-static.ttf

Pillow crashes on the variable Fraunces font, so pass a static instance. Get
one (opsz 144, weight 400, SOFT 100) from the Google Fonts CSS API:
    curl "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@144,400,100&text=Nishiki"
and download the TTF URL it returns. Chinese text uses the system's Noto Serif
CJK (Debian/Ubuntu package fonts-noto-cjk).
"""
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

REPO = Path(__file__).resolve().parents[1]
APP = REPO / "src/app"
FRAUNCES = sys.argv[1]
SERIF = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc"
SERIF_BOLD = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"
SC_INDEX = 2  # Noto Serif CJK SC inside the collection

NAVY = (7, 11, 29)
TAGLINE = ["喜欢锦明日海的普通大学生。", "写博客、学日语、玩贝斯、折腾服务器。"]


def circle_avatar(size):
    avatar = Image.open(REPO / "assets/brand/logo-avatar@2x.png").convert("RGBA")
    side = min(avatar.size)
    avatar = avatar.crop(((avatar.width - side) // 2, (avatar.height - side) // 2,
                          (avatar.width + side) // 2, (avatar.height + side) // 2))
    big = size * 4
    avatar = avatar.resize((big, big), Image.LANCZOS)
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, big - 1, big - 1), fill=255)
    out = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    out.paste(avatar, (0, 0), mask)
    return out.resize((size, size), Image.LANCZOS)


def icons():
    circle_avatar(256).save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    circle_avatar(192).save(APP / "icon.png", optimize=True)
    apple = Image.new("RGBA", (180, 180), NAVY + (255,))
    apple.alpha_composite(circle_avatar(148), (16, 16))
    apple.convert("RGB").save(APP / "apple-icon.png", optimize=True)


def share_image():
    width, height = 1200, 630
    scene = Image.open(REPO / "public/scene/street-night.jpg").convert("RGB")
    scale = max(width / scene.width, height / scene.height) * 1.04
    scene = scene.resize((round(scene.width * scale), round(scene.height * scale)), Image.LANCZOS)
    left = (scene.width - width) // 2 - 40
    top = (scene.height - height) // 2
    card = scene.crop((left, top, left + width, top + height)).convert("RGBA")

    # Readability shade from the left, like the hero.
    shade = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(shade)
    for x in range(width):
        t = x / width
        alpha = 225 if t < 0.05 else max(0, int(225 * (1 - (t - 0.05) / 0.6)))
        draw.line([(x, 0), (x, height)], fill=NAVY + (alpha,))
    card.alpha_composite(shade)

    random.seed(7)
    snow = Image.new("RGBA", (width, height))
    snow_draw = ImageDraw.Draw(snow)
    for _ in range(140):
        r = random.choice([1, 1, 1.5, 2, 2.5, 3.5])
        x, y = random.uniform(0, width), random.uniform(0, height)
        snow_draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, random.randint(110, 230)))
    card.alpha_composite(snow.filter(ImageFilter.GaussianBlur(0.8)))

    char = Image.open(REPO / "public/character/casual-fandisc-nishiki.png").convert("RGBA")
    char_height = 600
    char = char.resize((round(char.width * char_height / char.height), char_height), Image.LANCZOS)
    cx, cy = width - char.width - 120, height - char_height + 20
    shadow = Image.new("RGBA", (width, height))
    shadow.paste((0, 0, 0, 255), (cx, cy + 18), char.getchannel("A").point(lambda a: int(a * 0.55)))
    card.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(18)))
    card.alpha_composite(char, (cx, cy))

    kicker = ImageFont.truetype(SERIF_BOLD, 26, index=SC_INDEX)
    title = ImageFont.truetype(FRAUNCES, 150)
    tagline = ImageFont.truetype(SERIF, 30, index=SC_INDEX)
    small = ImageFont.truetype(SERIF, 22, index=SC_INDEX)

    x0 = 80
    draw = ImageDraw.Draw(card)
    draw.text((x0, 150), "ようこそ · 欢迎来玩", font=kicker, fill=(143, 201, 255))
    glow = Image.new("RGBA", (width, height))
    ImageDraw.Draw(glow).text((x0 - 6, 186), "Nishiki", font=title, fill=(140, 190, 255, 150))
    card.alpha_composite(glow.filter(ImageFilter.GaussianBlur(18)))
    draw = ImageDraw.Draw(card)
    draw.text((x0 - 6, 186), "Nishiki", font=title, fill=(238, 243, 255))
    for index, line in enumerate(TAGLINE):
        draw.text((x0, 392 + index * 48), line, font=tagline, fill=(230, 236, 250))
    draw.text((x0, 540), "nishikicn.com", font=small, fill=(158, 176, 208))

    card = card.convert("RGB")
    for name in ("opengraph-image.jpg", "twitter-image.jpg"):
        card.save(APP / name, quality=86, optimize=True, progressive=True)


if __name__ == "__main__":
    icons()
    share_image()
    print("Updated icons and share image in", APP)
