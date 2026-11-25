#!/usr/bin/env python3
"""Link + H1 checker for improved/ static site."""
from __future__ import annotations
import re
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1] / "improved"
HTML_FILES = sorted(ROOT.rglob("*.html"))

href_re = re.compile(r'''(?:href|src)=["']([^"']+)["']''', re.I)
css_url_re = re.compile(r'''url\(\s*['"]?([^'")]+)['"]?\s*\)''', re.I)
h1_re = re.compile(r"<h1\b[^>]*>", re.I)

SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:")


def resolve(base: Path, ref: str) -> Path | None:
    ref = ref.strip()
    if not ref or ref.startswith("#") or ref.startswith("?"):
        return None
    if any(ref.lower().startswith(s) for s in SKIP_SCHEMES):
        return None
    # strip query/hash
    path = unquote(urlparse(ref).path)
    if not path:
        return None
    if path.startswith("/"):
        # site-root absolute — treat as relative to ROOT
        target = (ROOT / path.lstrip("/")).resolve()
    else:
        target = (base.parent / path).resolve()
    return target


def main() -> int:
    missing: list[str] = []
    h1_issues: list[str] = []
    checked_files = 0

    for html in HTML_FILES:
        text = html.read_text(encoding="utf-8", errors="replace")
        checked_files += 1
        h1s = h1_re.findall(text)
        if len(h1s) != 1:
            h1_issues.append(f"{html.relative_to(ROOT)}: {len(h1s)} H1(s)")

        refs = set(href_re.findall(text))
        for ref in refs:
            target = resolve(html, ref)
            if target is None:
                continue
            # allow directories that would be index — we don't use that
            if not target.exists():
                missing.append(f"{html.relative_to(ROOT)} -> {ref}  (resolved {target})")

    # CSS url()
    for css in ROOT.rglob("*.css"):
        text = css.read_text(encoding="utf-8", errors="replace")
        for ref in css_url_re.findall(text):
            if ref.startswith("data:"):
                continue
            target = resolve(css, ref)
            if target is not None and not target.exists():
                missing.append(f"{css.relative_to(ROOT)} -> {ref}")

    print(f"Checked {checked_files} HTML files under {ROOT}")
    print(f"H1 issues: {len(h1_issues)}")
    for row in h1_issues:
        print("  ", row)
    print(f"Missing assets/links: {len(missing)}")
    for row in missing[:80]:
        print("  ", row)
    if len(missing) > 80:
        print(f"  ... and {len(missing) - 80} more")

    ok = not h1_issues and not missing
    print("PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
