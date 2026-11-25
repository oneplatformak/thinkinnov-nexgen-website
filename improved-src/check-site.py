#!/usr/bin/env python3
"""Static checks for the built site in docs/.

Checks every HTML file for: exactly one H1; links, assets and CSS url()s that
resolve to a file; #fragment targets that exist; duplicate ids; a lang
attribute; a title and meta description (unique within each language); images
without alt; canonical and reciprocal hreflang links; that the legacy
anchors listed in COVERAGE terms still exist; that every English page has a
Japanese counterpart (and the reverse) apart from the named redirect stubs;
and that nothing in docs/ loads a resource from another host or contains a
known tracker string.

Usage: python3 improved-src/check-site.py
"""
from __future__ import annotations
import re
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1] / "docs"
HTML_FILES = sorted(ROOT.rglob("*.html"))
SITE = "https://thinkinnovnexgen.co.jp/"

href_re = re.compile(r'''\b(?:href|src)=["']([^"']+)["']''', re.I)
css_url_re = re.compile(r'''url\(\s*['"]?([^'")]+)['"]?\s*\)''', re.I)
h1_re = re.compile(r"<h1\b[^>]*>", re.I)
id_re = re.compile(r'''\bid=["']([^"']+)["']''')
img_re = re.compile(r"<img\b[^>]*>", re.I)
title_re = re.compile(r"<title>(.*?)</title>", re.S)
desc_re = re.compile(r'<meta name="description" content="([^"]*)"')
canonical_re = re.compile(r'<link rel="canonical" href="([^"]+)"')
alternate_re = re.compile(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"')
script_style_re = re.compile(r"<(script|style)\b.*?</\1>", re.S | re.I)

SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:")

# Redirect stubs for the old single-page URLs: no layout, not in the sitemap.
STUBS = {"page.html", "jobdetails.html", "application.html"}

# Strings from the script that the staging host (GoDaddy cPanel) injects into
# crawled HTML, plus the common analytics and tag loaders. None may appear in
# any text file under docs/. The first seven were taken from a diff of
# staging-original/thinkinnov-nexgen/index.html against the official file.
TRACKER_STRINGS = [
    "_trfq", "_trfd", "tccl.min.js", "tccl.baseHost", "traffic-assets", "wsimg.com", "secureserver.net",
    "googletagmanager", "google-analytics", "gtag(", "fbq(", "hotjar", "clarity.ms", "doubleclick",
]
# Absolute URLs that may appear in a resource-loading position. Nothing is
# fetched from them: they are XML namespaces and the schema.org vocabulary.
RESOURCE_ALLOW = ("http://www.w3.org/", "https://schema.org")
TEXT_SUFFIXES = {".html", ".css", ".js", ".php", ".xml", ".txt", ".svg", ".json", ".webmanifest", ".htaccess", ".md"}

# Tags whose URL attributes make the browser fetch something. <a href> is a
# link the visitor chooses to follow, so it is not in this list.
loader_res = [
    re.compile(r"<(?:script|img|iframe|source|video|audio|embed|track|input)\b[^>]*?\bsrc=[\"']([^\"']+)[\"']", re.I),
    re.compile(r"<link\b(?![^>]*\brel=[\"'](?:canonical|alternate)[\"'])[^>]*?\bhref=[\"']([^\"']+)[\"']", re.I),
    re.compile(r"<object\b[^>]*?\bdata=[\"']([^\"']+)[\"']", re.I),
    re.compile(r"<form\b[^>]*?\baction=[\"']([^\"']+)[\"']", re.I),
    re.compile(r"<(?:video)\b[^>]*?\bposter=[\"']([^\"']+)[\"']", re.I),
    re.compile(r"<meta\b[^>]*http-equiv=[\"']refresh[\"'][^>]*url=([^\"'>]+)", re.I),
]
srcset_re = re.compile(r"\bsrcset=[\"']([^\"']+)[\"']", re.I)
abs_url_re = re.compile(r"""(?:https?:)?//[A-Za-z0-9.-]+\.[A-Za-z]{2,}[^\s"'<>)]*""")
css_import_re = re.compile(r"@import\s+(?:url\()?\s*['\"]?([^'\")\s;]+)", re.I)


def is_remote(ref: str) -> bool:
    ref = ref.strip().lower()
    return ref.startswith(("http://", "https://", "//"))


def third_party(problems: dict[str, list[str]]) -> tuple[int, int]:
    """Tracker strings anywhere, and remote URLs wherever something would be loaded."""
    files = [f for f in sorted(ROOT.rglob("*")) if f.is_file() and (f.suffix.lower() in TEXT_SUFFIXES or f.name == ".htaccess")]
    loaders = 0
    for file in files:
        rel = file.relative_to(ROOT).as_posix()
        text = file.read_text(encoding="utf-8", errors="replace")
        for needle in TRACKER_STRINGS:
            if needle in text:
                problems["tracker strings"].append(f"{rel}: {needle}")
        refs: list[str] = []
        if file.suffix == ".html":
            for pattern in loader_res:
                refs += pattern.findall(text)
            for value in srcset_re.findall(text):
                refs += [part.strip().split(" ")[0] for part in value.split(",")]
            for block in re.findall(r"<style\b[^>]*>(.*?)</style>", text, re.S | re.I):
                refs += css_url_re.findall(block) + css_import_re.findall(block)
            for block in re.findall(r"<script\b(?![^>]*application/ld\+json)[^>]*>(.*?)</script>", text, re.S | re.I):
                refs += abs_url_re.findall(block)
        elif file.suffix == ".css":
            refs += css_url_re.findall(text) + css_import_re.findall(text)
        elif file.suffix == ".js":
            refs += abs_url_re.findall(text)
        loaders += len(refs)
        for ref in refs:
            if is_remote(ref) and not ref.startswith(RESOURCE_ALLOW):
                problems["third-party resources"].append(f"{rel}: {ref[:100]}")
    return len(files), loaders


# Anchors that existed before the rebuild and must keep working.
LEGACY_ANCHORS = {
    "index.html": ["home", "about", "problem", "plm", "services", "products", "solutions", "industries", "customers", "testimonials", "contact"],
    "about.html": ["gallery", "leadership", "profile"],
    "services.html": ["pre-implementation", "implementation", "post-implementation"],
    "products.html": ["nx", "solid-edge", "capital", "teamcenter", "tecnomatix", "mendix"],
}


def resolve(base: Path, ref: str) -> tuple[Path | None, str]:
    """Returns the file a reference points to and its fragment."""
    ref = ref.strip()
    if not ref or ref.startswith("?"):
        return None, ""
    if any(ref.lower().startswith(s) for s in SKIP_SCHEMES):
        return None, ""
    parsed = urlparse(ref)
    path = unquote(parsed.path)
    fragment = unquote(parsed.fragment)
    if not path:
        return base, fragment
    if path.startswith("/"):
        target = (ROOT / path.lstrip("/")).resolve()
    else:
        target = (base.parent / path).resolve()
    if target.is_dir():
        target = target / "index.html"
    return target, fragment


def main() -> int:
    problems: dict[str, list[str]] = defaultdict(list)
    texts = {html: html.read_text(encoding="utf-8", errors="replace") for html in HTML_FILES}
    ids = {html: id_re.findall(script_style_re.sub("", text)) for html, text in texts.items()}
    titles: dict[str, dict[str, list[str]]] = {"en": defaultdict(list), "ja": defaultdict(list)}
    descriptions: dict[str, dict[str, list[str]]] = {"en": defaultdict(list), "ja": defaultdict(list)}
    links = fragments = 0

    for html, text in texts.items():
        rel = html.relative_to(ROOT).as_posix()
        lang = "ja" if rel.startswith("ja/") else "en"
        stub = rel in STUBS or rel.removeprefix("ja/") in STUBS

        if len(h1_re.findall(text)) != 1:
            problems["H1"].append(f"{rel}: {len(h1_re.findall(text))} H1(s)")
        if f'<html lang="{lang}"' not in text:
            problems["lang attribute"].append(rel)

        seen = set()
        for value in ids[html]:
            if value in seen:
                problems["duplicate ids"].append(f"{rel}: #{value}")
            seen.add(value)

        for ref in set(href_re.findall(text)):
            target, fragment = resolve(html, ref)
            if target is None:
                continue
            links += 1
            if not target.exists():
                problems["missing files"].append(f"{rel} -> {ref}")
                continue
            if fragment and target.suffix == ".html":
                fragments += 1
                if target not in ids:
                    problems["missing anchors"].append(f"{rel} -> {ref} (target not checked)")
                elif fragment not in ids[target]:
                    problems["missing anchors"].append(f"{rel} -> {ref}")

        for tag in img_re.findall(text):
            if " alt=" not in tag:
                problems["images without alt"].append(f"{rel}: {tag[:80]}")
            if " width=" not in tag or " height=" not in tag:
                problems["images without dimensions"].append(f"{rel}: {tag[:80]}")

        if stub:
            continue
        title = title_re.search(text)
        desc = desc_re.search(text)
        if not title or not title.group(1).strip():
            problems["title"].append(f"{rel}: missing")
        else:
            titles[lang][title.group(1).strip()].append(rel)
        if not desc or not desc.group(1).strip():
            problems["meta description"].append(f"{rel}: missing")
        else:
            descriptions[lang][desc.group(1).strip()].append(rel)

        if rel.endswith("404.html"):
            continue
        canonical = canonical_re.search(text)
        expected = SITE + ("" if rel == "index.html" else "ja/" if rel == "ja/index.html" else rel)
        if not canonical or canonical.group(1) != expected:
            problems["canonical"].append(f"{rel}: {canonical.group(1) if canonical else 'missing'} (expected {expected})")
        alternates = dict(alternate_re.findall(text))
        for code in ("en", "ja", "x-default"):
            if code not in alternates:
                problems["hreflang"].append(f"{rel}: no {code}")
        other = rel.removeprefix("ja/") if lang == "ja" else "ja/" + rel
        if not (ROOT / other).exists():
            problems["language parity"].append(f"{rel}: no counterpart {other}")
            continue
        # Reciprocal: this page's link to the other language must be that page's
        # own canonical address, and x-default must be the English page.
        other_canonical = canonical_re.search(texts[ROOT / other])
        other_code = "en" if lang == "ja" else "ja"
        if other_canonical and alternates.get(other_code) != other_canonical.group(1):
            problems["hreflang"].append(f"{rel}: {other_code} link {alternates.get(other_code)} is not the canonical of {other}")
        if alternates.get(lang) != expected:
            problems["hreflang"].append(f"{rel}: {lang} link is not this page")
        english = expected.replace(SITE + "ja/", SITE) if lang == "ja" else expected
        if alternates.get("x-default") != english:
            problems["hreflang"].append(f"{rel}: x-default is not the English page")

    for lang in ("en", "ja"):
        for value, pages in titles[lang].items():
            if len(pages) > 1:
                problems["duplicate titles"].append(f"{', '.join(pages)}: {value}")
        for value, pages in descriptions[lang].items():
            if len(pages) > 1:
                problems["duplicate descriptions"].append(f"{', '.join(pages)}: {value[:70]}")

    for page, anchors in LEGACY_ANCHORS.items():
        for prefix in ("", "ja/"):
            html = ROOT / (prefix + page)
            for anchor in anchors:
                if anchor not in ids.get(html, []):
                    problems["legacy anchors"].append(f"{prefix}{page}#{anchor}")

    for css in ROOT.rglob("*.css"):
        for ref in css_url_re.findall(css.read_text(encoding="utf-8", errors="replace")):
            if ref.startswith("data:"):
                continue
            target, _ = resolve(css, ref)
            if target is not None and not target.exists():
                problems["missing files"].append(f"{css.relative_to(ROOT)} -> {ref}")

    scanned, loaders = third_party(problems)
    english_pages = [h for h in HTML_FILES if not h.relative_to(ROOT).as_posix().startswith("ja/") and h.relative_to(ROOT).as_posix() not in STUBS]
    japanese_pages = [h for h in HTML_FILES if h.relative_to(ROOT).as_posix().startswith("ja/")]
    for name in STUBS:
        if not (ROOT / name).exists():
            problems["language parity"].append(f"named stub {name} does not exist")
        if (ROOT / "ja" / name).exists():
            problems["language parity"].append(f"ja/{name} exists but {name} is listed as a stub without a counterpart")

    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8") if (ROOT / "sitemap.xml").exists() else ""
    for html in HTML_FILES:
        rel = html.relative_to(ROOT).as_posix()
        if rel.removeprefix("ja/") in STUBS or rel.endswith("404.html"):
            continue
        url = SITE + ("" if rel == "index.html" else "ja/" if rel == "ja/index.html" else rel)
        if f"<loc>{url}</loc>" not in sitemap:
            problems["sitemap.xml"].append(f"{rel} not listed")
    for loc in re.findall(r"<loc>([^<]+)</loc>", sitemap):
        rel = loc.removeprefix(SITE)
        if rel == "" or rel.endswith("/"):
            rel += "index.html"
        if not (ROOT / rel).exists():
            problems["sitemap.xml"].append(f"{loc} listed but {rel} does not exist")
        pair = rel.removeprefix("ja/") if rel.startswith("ja/") else "ja/" + rel
        pair_url = SITE + ("" if pair == "index.html" else "ja/" if pair == "ja/index.html" else pair)
        if f"<loc>{pair_url}</loc>" not in sitemap:
            problems["sitemap.xml"].append(f"{loc} listed without its other-language page {pair_url}")

    print(f"Checked {len(HTML_FILES)} HTML files under {ROOT}")
    print(f"Internal links and assets resolved: {links} (of which {fragments} with a #fragment)")
    print(f"Language pairs: {len(english_pages)} English pages, {len(japanese_pages)} Japanese pages, {len(STUBS)} redirect stubs without a counterpart ({', '.join(sorted(STUBS))})")
    print(f"Third-party scan: {scanned} text files, {loaders} resource references examined")
    checks = [
        "H1", "lang attribute", "duplicate ids", "missing files", "missing anchors", "images without alt",
        "images without dimensions", "title", "meta description", "duplicate titles", "duplicate descriptions",
        "canonical", "hreflang", "language parity", "legacy anchors", "sitemap.xml", "tracker strings", "third-party resources",
    ]
    for name in checks:
        rows = problems.get(name, [])
        print(f"{name}: {len(rows)}")
        for row in rows[:40]:
            print("   ", row)
        if len(rows) > 40:
            print(f"    ... and {len(rows) - 40} more")
    ok = not any(problems.values())
    print("PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
