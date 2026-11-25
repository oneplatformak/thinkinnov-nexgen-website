#!/usr/bin/env python3
"""Checks the built site against the original (staging-original/) and against
the things that must never be published.

1. The four testimonials and their attributions are word-for-word the same.
2. The same 21 customer logos, with the same names, in the same order.
3. The same job titles, each with a page in both languages.
4. Partner wording appears only where the source has it.
5. No placeholder text, no banned wording, no empty headings.
6. Structured data parses and contains none of the excluded types.
7. No credentials in any tracked file.

Usage: python3 improved-src/tools/check-source.py
"""
from __future__ import annotations
import html
import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DOCS = REPO / "docs"
STAGING = REPO / "staging-original" / "thinkinnov-nexgen"

failures: list[str] = []
lines: list[str] = []


def report(ok: bool, label: str, detail: str = "") -> None:
    lines.append(f"{'PASS' if ok else 'FAIL'}  {label}{(' — ' + detail) if detail else ''}")
    if not ok:
        failures.append(label)


def visible(markup: str) -> str:
    markup = re.sub(r"<(script|style|template)\b.*?</\1>", " ", markup, flags=re.S | re.I)
    markup = re.sub(r"<wbr\s*/?>", "", markup, flags=re.I)
    markup = re.sub(r"<[^>]+>", " ", markup)
    return re.sub(r"\s+", " ", html.unescape(markup)).strip()


def squash(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\u2019", "'").replace("\u2018", "'")).strip()


pages = sorted(p for p in DOCS.rglob("*.html"))
text_of = {p.relative_to(DOCS).as_posix(): visible(p.read_text(encoding="utf-8")) for p in pages}
raw_of = {p.relative_to(DOCS).as_posix(): p.read_text(encoding="utf-8") for p in pages}
staging_index = (STAGING / "index.html").read_text(encoding="utf-8")

# 1. Testimonials
cards = re.findall(r'<article class="testimonial-card[^"]*">(.*?)</article>', staging_index, flags=re.S)
report(len(cards) == 4, "staging has four testimonials", str(len(cards)))
for lang, page in (("en", "index.html"), ("ja", "ja/index.html")):
    body = squash(text_of[page])
    for card in cards:
        quote = squash(html.unescape(re.sub(r"<[^>]+>", "", re.search(r"<p>(.*?)</p>", card, flags=re.S).group(1))))
        who = [squash(html.unescape(x)) for x in re.findall(r"<(?:strong|small)>(.*?)</(?:strong|small)>", card)]
        report(quote in body, f"testimonial verbatim on {page}", quote[:48] + "…")
        for name in who:
            report(name in body, f"attribution on {page}", name)

# 2. Customer logos
staging_logos = re.findall(r'<img[^>]*src="assets/customers/[^"]+"[^>]*alt="([^"]*)"', staging_index)
if not staging_logos:
    staging_logos = [alt for src, alt in re.findall(r'<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"', staging_index) if "customers/" in src]
staging_logos = [a for a in staging_logos if a]
for page in ("index.html", "ja/index.html"):
    built = re.findall(r'<img src="[^"]*assets/img/customers/[^"]+"[^>]*alt="([^"]*)"', raw_of[page])
    report(built == staging_logos and len(built) == 21, f"21 customer logos, same names and order, on {page}", f"{len(built)} built, {len(staging_logos)} in staging")
logo_files = {m for page in raw_of.values() for m in re.findall(r'assets/img/customers/([^"]+)"', page)}
report(all((DOCS / "assets/img/customers" / f).is_file() for f in logo_files), "every customer logo file exists", str(len(logo_files)))

# 3. Jobs
jobs_js = (STAGING / "assets" / "jobs.js").read_text(encoding="utf-8").split("].map(")[0]
# The first role is written out as an object; the other seventeen are rows of [title, focus, experience].
staging_jobs = re.findall(r'^\s*title:\s*"([^"]+)"', jobs_js, flags=re.M) + re.findall(r'^\s*\["([^"]+)",\s*"[^"]*",\s*"[^"]*"\]', jobs_js, flags=re.M)
job_pages = sorted(p for p in text_of if re.match(r"careers/\d\d-", p))
ja_job_pages = sorted(p for p in text_of if re.match(r"ja/careers/\d\d-", p))
report(len(staging_jobs) == len(job_pages) == len(ja_job_pages), "one job page per staging role, in both languages", f"{len(staging_jobs)} roles, {len(job_pages)} EN pages, {len(ja_job_pages)} JA pages")
for title, page in zip(staging_jobs, job_pages):
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", raw_of[page], flags=re.S)
    report(bool(h1) and squash(visible(h1.group(1))) == squash(title), f"job title unchanged on {page}", title)
report("JobPosting" not in "".join(raw_of.values()), "no JobPosting structured data")

# 4. Partner wording, only where the source places it
def pages_with(phrase: str) -> list[str]:
    return sorted(p for p, t in text_of.items() if phrase.lower() in t.lower())

# The Japanese form is the original site's own (staging assets/i18n.js).
solution_partner = sorted(set(pages_with("Siemens Solution Partner") + pages_with("Siemensソリューションパートナー")))
report(solution_partner == ["index.html", "ja/index.html"], '"Siemens Solution Partner" only on the home page', ", ".join(solution_partner))
# Once per home page, in the hero, as the source has it; counted in the whole
# file so that titles, descriptions, attributes and structured data count too.
partner_re = re.compile(r"Solution\s*Partner|ソリューション\s*パートナー", flags=re.I)
partner_counts = {p: len(partner_re.findall(re.sub(r"<wbr\s*/?>", "", r))) for p, r in raw_of.items()}
partner_counts = {p: n for p, n in partner_counts.items() if n}
report(partner_counts == {"index.html": 1, "ja/index.html": 1}, '"Siemens Solution Partner" / 「Siemensソリューションパートナー」 exactly once on each home page and on no other page', ", ".join(f"{p}: {n}" for p, n in sorted(partner_counts.items())))
for home in ("index.html", "ja/index.html"):
    hero = re.search(r'<section class="hero\b.*?</section>', raw_of[home], flags=re.S)
    report(bool(hero) and len(partner_re.findall(re.sub(r"<wbr\s*/?>", "", hero.group(0)))) == 1, f"that one occurrence is in the hero of {home}")
report(not pages_with("ソリューションパートナー") or pages_with("ソリューションパートナー") == ["ja/index.html"], "Japanese partner wording only on the Japanese home page", ", ".join(pages_with("ソリューションパートナー")))
report(pages_with("Expert Partner") == ["about.html", "ja/about.html"], '"Expert Partner - PLM" only on About', ", ".join(pages_with("Expert Partner")))
report(pages_with("A Strategic Partnership in Japan") == ["about.html"] or pages_with("A Strategic Partnership in Japan") == ["about.html", "ja/about.html"], '"ThinkInnov-NexGen KK - A Strategic Partnership in Japan" only on About', ", ".join(pages_with("A Strategic Partnership in Japan")))
heads = "".join(re.search(r"<head>.*?</head>", r, flags=re.S).group(0) for r in raw_of.values() if "<head>" in r)
report(not re.search(r"Solution Partner|Expert Partner|ソリューションパートナー|エキスパートパートナー", heads), "no partner wording in any <head> (titles, descriptions, structured data)")
footers = "".join(m.group(0) for r in raw_of.values() for m in [re.search(r"<footer\b.*?</footer>", r, flags=re.S)] if m)
report(not re.search(r"Solution Partner|Expert Partner|ソリューションパートナー|エキスパートパートナー", footers), "no partner wording in the footer")
report("our key customers" in text_of["index.html"].lower(), 'source heading "Our Key Customers" kept (the site sets headings in sentence case)')

# 4b. Diagrams drawn for this site are labelled as conceptual, in both languages
figures = [(p, m.group(0)) for p, r in raw_of.items() for m in re.finditer(r'<figure class="fig\b.*?</figure>', r, flags=re.S)]
unlabelled = sorted({p for p, f in figures if not re.search(r'<figcaption[^>]*>\s*<span class="fig-no">(Conceptual diagram|概念図)</span>', f)})
report(bool(figures) and not unlabelled, f"every drawn diagram ({len(figures)} on {len({p for p, _ in figures})} pages) is captioned “Conceptual diagram” / 「概念図」", ", ".join(unlabelled))
report(not any(re.search(r"fig-axis|fig-trend", r) for r in raw_of.values()), "no drawn diagram has chart axes or a trend line")

# 5. Wording that must not appear in visible text
BANNED = [
    "joint venture", "合弁", "digital twin", "デジタルツイン", "Trusted by Industry Leaders",
    "lorem ipsum", "coming soon", "under construction", "TODO", "TBD", "placeholder text",
    "world-leading", "world leading", "number one", "best-in-class", "best in class", "guaranteed",
    "award-winning", "ISO 9001", "ISO 27001", "ISMS",
]
for phrase in BANNED:
    hits = [p for p, t in text_of.items() if re.search(r"(?<![A-Za-z])" + re.escape(phrase) + r"(?![A-Za-z])", t, flags=re.I)]
    report(not hits, f'"{phrase}" absent from visible text', ", ".join(hits[:5]))
empty = [p for p, r in raw_of.items() if re.search(r"<h[1-6][^>]*>\s*</h[1-6]>", r)]
report(not empty, "no empty headings", ", ".join(empty[:5]))
stars = [p for p, t in text_of.items() if "★" in t]
report(not stars, "no star ratings", ", ".join(stars[:5]))

# 6. Structured data
types: dict[str, int] = {}
bad_json: list[str] = []
keys: set[str] = set()


def walk(node) -> None:
    if isinstance(node, dict):
        t = node.get("@type")
        for name in (t if isinstance(t, list) else [t]):
            if name:
                types[name] = types.get(name, 0) + 1
        keys.update(node.keys())
        for value in node.values():
            walk(value)
    elif isinstance(node, list):
        for item in node:
            walk(item)


for page, raw in raw_of.items():
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw, flags=re.S):
        try:
            walk(json.loads(block))
        except ValueError:
            bad_json.append(page)
report(not bad_json, "every JSON-LD block parses", ", ".join(bad_json[:5]))
for excluded in ("JobPosting", "Review", "AggregateRating", "Rating", "Offer", "FAQPage"):
    report(excluded not in types, f"no {excluded} structured data")
for key in ("legalName", "award", "aggregateRating", "review", "foundingDate", "numberOfEmployees"):
    report(key not in keys, f'no "{key}" property in structured data')
lines.append("INFO  structured data types: " + ", ".join(f"{k} ×{v}" for k, v in sorted(types.items())))

# 7. Credentials in tracked files
SECRET_PATTERNS = [
    r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----",
    r"AKIA[0-9A-Z]{16}",
    r"gh[pousr]_[A-Za-z0-9]{30,}",
    r"sk-[A-Za-z0-9]{32,}",
    r"xox[baprs]-[A-Za-z0-9-]{10,}",
    r"AIza[0-9A-Za-z_\-]{35}",
    r"(?i)\b(?:password|passwd|secret|api[_-]?key|access[_-]?token|smtp_pass)\b\s*[:=]\s*[\"'][^\"'\s]{6,}[\"']",
]
tracked = subprocess.run(["git", "ls-files"], cwd=REPO, capture_output=True, text=True, check=True).stdout.split("\n")
secret_hits: list[str] = []
scanned = 0
for name in tracked:
    path = REPO / name
    if not name or not path.is_file() or path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".woff2", ".ico", ".gif", ".pdf", ".zip", ".avif"}:
        continue
    if name == "improved-src/tools/check-source.py":
        continue
    try:
        content = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    scanned += 1
    for pattern in SECRET_PATTERNS:
        if re.search(pattern, content):
            secret_hits.append(f"{name} ({pattern[:24]})")
report(not secret_hits, f"no credentials in {scanned} tracked text files", "; ".join(secret_hits[:5]))
env_files = [n for n in tracked if re.search(r"(^|/)\.env(\.|$)|\.pem$|id_rsa", n)]
report(not env_files, "no .env, .pem or key files tracked", ", ".join(env_files))

print("\n".join(lines))
print()
print(f"{len(text_of)} HTML files read. {sum(1 for l in lines if l.startswith('PASS'))} checks passed, {len(failures)} failed.")
print("RESULT:", "FAIL" if failures else "PASS")
sys.exit(1 if failures else 0)
