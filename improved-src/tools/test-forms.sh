#!/usr/bin/env bash
# Local failure-path tests for docs/contact.php and docs/apply.php.
#
# No mail leaves this machine: PHP is started with a sendmail_path that writes
# each message to a file (or that always fails, for the mail-failure test).
# Usage: bash improved-src/tools/test-forms.sh
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$(mktemp -d)"
OUT="$WORK/mail"
mkdir -p "$OUT"
PORT_OK=8821
PORT_FAIL=8822
PASS=0
FAIL=0

cat > "$WORK/capture.sh" <<EOF
#!/bin/sh
cat > "$OUT/\$(date +%s%N).eml"
EOF
chmod +x "$WORK/capture.sh"

INI=(-d upload_max_filesize=8M -d post_max_size=10M -d display_errors=0)
php "${INI[@]}" -d sendmail_path="$WORK/capture.sh" -S 127.0.0.1:$PORT_OK -t "$ROOT/docs" >"$WORK/ok.log" 2>&1 &
PID_OK=$!
php "${INI[@]}" -d sendmail_path=/bin/false -S 127.0.0.1:$PORT_FAIL -t "$ROOT/docs" >"$WORK/fail.log" 2>&1 &
PID_FAIL=$!
trap 'kill $PID_OK $PID_FAIL 2>/dev/null; rm -rf "$WORK"' EXIT
sleep 1

reset() { rm -rf "${TMPDIR:-/tmp}"/tin_contact_rl "${TMPDIR:-/tmp}"/tin_apply_rl; rm -f "$OUT"/*.eml; }
mails() { ls "$OUT" 2>/dev/null | wc -l | tr -d ' '; }
last_mail() { cat "$OUT"/"$(ls "$OUT" | tail -1)"; }

# check <name> <expected status> <expected substring in body> <actual status> <actual body>
check() {
  if [ "$2" = "$4" ] && printf '%s' "$5" | grep -qF -- "$3"; then
    PASS=$((PASS + 1)); echo "PASS  $1 ($4)"
  else
    FAIL=$((FAIL + 1)); echo "FAIL  $1: expected $2 containing '$3', got $4: $(printf '%s' "$5" | head -c 200)"
  fi
}
assert() { # assert <name> <command...>
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then PASS=$((PASS + 1)); echo "PASS  $name"; else FAIL=$((FAIL + 1)); echo "FAIL  $name"; fi
}

post() { # post <port> <path> <json|html> <curl form args...>  -> sets STATUS and BODY
  local port="$1" path="$2" mode="$3"; shift 3
  local accept=(-H "Accept: application/json")
  [ "$mode" = html ] && accept=()
  BODY="$(curl -s -o - -w '\n%{http_code}' "${accept[@]}" "$@" "http://127.0.0.1:$port/$path")"
  STATUS="${BODY##*$'\n'}"
  BODY="${BODY%$'\n'*}"
}

OLD=$(( ($(date +%s) - 60) * 1000 ))
GOOD=(--data-urlencode "type=product" --data-urlencode "topic=product-teamcenter" --data-urlencode "need=quality"
  --data-urlencode "name=Test Person" --data-urlencode "email=test.person@example.com"
  --data-urlencode "message=Hello from the local test." --data-urlencode "consent=1"
  --data-urlencode "form_started=$OLD" --data-urlencode "lang=en")

echo "== contact.php =="
reset
BODY="$(curl -s -o - -w '\n%{http_code}' -H 'Accept: application/json' http://127.0.0.1:$PORT_OK/contact.php)"; STATUS="${BODY##*$'\n'}"
check "GET is refused" 405 '"ok":false' "$STATUS" "$BODY"
assert "GET sends no mail" test "$(mails)" = 0

post $PORT_OK contact.php json "${GOOD[@]}"
check "valid enquiry is accepted" 200 '"ok":true' "$STATUS" "$BODY"
assert "valid enquiry writes exactly one mail" test "$(mails)" = 1
assert "mail goes to the fixed recipient" grep -q '^To: info@thinkinnovnexgen.co.jp' <(last_mail)
assert "mail has the whitelisted type and topic labels" grep -q 'Topic: Teamcenter' <(last_mail)
assert "mail has the business need label" grep -q 'Business need: Manage quality from planning to production' <(last_mail)
assert "reply-to is the validated sender" grep -q '^Reply-To: <test.person@example.com>' <(last_mail)

reset
post $PORT_OK contact.php json "${GOOD[@]}" --data-urlencode "to=attacker@example.com" --data-urlencode "recipient=attacker@example.com" --data-urlencode "cc=attacker@example.com" --data-urlencode "extra=ignored"
check "extra fields are ignored" 200 '"ok":true' "$STATUS" "$BODY"
assert "recipient cannot be overridden" bash -c "! grep -qi 'attacker@example.com' '$OUT'/*.eml"
assert "unknown fields are not mailed" bash -c "! grep -q 'ignored' '$OUT'/*.eml"

reset
post $PORT_OK contact.php json --data-urlencode "type=product" --data-urlencode $'name=Eve\r\nBcc: victim@example.com' --data-urlencode "email=eve@example.com" --data-urlencode $'message=line one\r\nBcc: victim@example.com' --data-urlencode "consent=1" --data-urlencode "form_started=$OLD"
check "name with CR/LF is accepted as one line" 200 '"ok":true' "$STATUS" "$BODY"
assert "no injected header reaches the mail headers" bash -c "! sed '/^\r\{0,1\}\$/q' '$OUT'/*.eml | grep -qi '^Bcc:'"

reset
post $PORT_OK contact.php json --data-urlencode "type=product" --data-urlencode "name=Eve" --data-urlencode $'email=eve@example.com\r\nBcc: victim@example.com' --data-urlencode "message=x" --data-urlencode "consent=1" --data-urlencode "form_started=$OLD"
check "email with CR/LF is rejected" 400 '"code":"email"' "$STATUS" "$BODY"
assert "rejected email sends no mail" test "$(mails)" = 0

reset
post $PORT_OK contact.php json --data-urlencode "type=product" --data-urlencode "email=a@example.com" --data-urlencode "message=x" --data-urlencode "consent=1" --data-urlencode "form_started=$OLD"
check "missing name is rejected" 400 '"code":"invalid"' "$STATUS" "$BODY"
post $PORT_OK contact.php json --data-urlencode "type=product" --data-urlencode "name=A" --data-urlencode "email=not-an-email" --data-urlencode "message=x" --data-urlencode "consent=1" --data-urlencode "form_started=$OLD"
check "invalid email is rejected" 400 '"code":"email"' "$STATUS" "$BODY"
post $PORT_OK contact.php json --data-urlencode "type=product" --data-urlencode "name=A" --data-urlencode "email=a@example.com" --data-urlencode "message=x" --data-urlencode "form_started=$OLD"
check "missing consent is rejected" 400 '"code":"consent"' "$STATUS" "$BODY"
post $PORT_OK contact.php json --data-urlencode "type=not-a-type" --data-urlencode "name=A" --data-urlencode "email=a@example.com" --data-urlencode "message=x" --data-urlencode "consent=1" --data-urlencode "form_started=$OLD"
check "unknown enquiry type is rejected" 400 '"code":"invalid"' "$STATUS" "$BODY"
post $PORT_OK contact.php json "${GOOD[@]}" --data-urlencode "phone=<script>alert(1)</script>"
check "malformed phone is rejected" 400 '"code":"invalid"' "$STATUS" "$BODY"
post $PORT_OK contact.php json "${GOOD[@]}" --data-urlencode "website=http://spam.example"
check "filled honeypot is rejected, not reported as sent" 400 '"ok":false' "$STATUS" "$BODY"
post $PORT_OK contact.php json --data-urlencode "type=product" --data-urlencode "name=A" --data-urlencode "email=a@example.com" --data-urlencode "message=x" --data-urlencode "consent=1" --data-urlencode "form_started=$(( $(date +%s) * 1000 ))"
check "submission inside 3 seconds is rejected" 400 '"code":"too_fast"' "$STATUS" "$BODY"
assert "none of the rejected requests sent mail" test "$(mails)" = 0

reset
post $PORT_OK contact.php json "${GOOD[@]}" --data-urlencode "topic=product-does-not-exist" --data-urlencode "industry=<b>x</b>"
check "unknown topic is dropped, enquiry still accepted" 200 '"ok":true' "$STATUS" "$BODY"
assert "dropped topic is mailed as '-'" grep -q '^Topic: -' <(last_mail)
assert "dropped industry is mailed as '-'" grep -q '^Industry: -' <(last_mail)

reset
post $PORT_OK contact.php json "${GOOD[@]}" --data-urlencode "message=$(head -c 9000 /dev/zero | tr '\0' 'a')"
check "over-long message is accepted but truncated" 200 '"ok":true' "$STATUS" "$BODY"
assert "message is cut to 5000 characters" test "$(grep -o 'a\{5000,\}' "$OUT"/*.eml | head -1 | wc -c)" -le 5002

reset
for i in 1 2 3 4 5 6 7 8; do post $PORT_OK contact.php json "${GOOD[@]}"; done
check "8th enquiry in the window is still accepted" 200 '"ok":true' "$STATUS" "$BODY"
post $PORT_OK contact.php json "${GOOD[@]}"
check "9th enquiry in the window is rate limited" 429 '"code":"rate"' "$STATUS" "$BODY"
assert "rate-limited request sent no mail" test "$(mails)" = 8

reset
post $PORT_OK contact.php html "${GOOD[@]}"
check "without scripts: success is an HTML page" 200 'Your enquiry has been sent' "$STATUS" "$BODY"
post $PORT_OK contact.php html --data-urlencode "type=product" --data-urlencode "lang=ja" --data-urlencode "name=" --data-urlencode "email=a@example.com" --data-urlencode "message=x" --data-urlencode "consent=1"
check "without scripts: Japanese error page" 400 '入力内容に不足または誤りがあります' "$STATUS" "$BODY"
assert "error page links back to the Japanese form" grep -q 'href="ja/contact.html"' <(printf '%s' "$BODY")
post $PORT_OK contact.php html "${GOOD[@]}" --data-urlencode "lang=<script>"
check "unknown language falls back to English" 200 '<html lang="en">' "$STATUS" "$BODY"

reset
post $PORT_FAIL contact.php json "${GOOD[@]}"
check "mail failure is reported as failure" 500 '"code":"mail_failed"' "$STATUS" "$BODY"

BODY="$(curl -s -o - -w '\n%{http_code}' http://127.0.0.1:$PORT_OK/inc/enquiry-options.php)"; STATUS="${BODY##*$'\n'}"
assert "inc/enquiry-options.php prints nothing when requested directly" test -z "${BODY%$'\n'*}"

echo "== apply.php =="
printf '%%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%%%EOF\n' > "$WORK/cv.pdf"
printf 'MZ\x90\x00 this is not a pdf' > "$WORK/fake.pdf"
printf 'plain text' > "$WORK/cv.txt"
{ printf '%%PDF-1.4\n'; head -c $((6 * 1024 * 1024)) /dev/zero; } > "$WORK/big.pdf"
APPLY=(-F "job=01-tech-lead-teamcenter" -F "first_name=Test" -F "last_name=Candidate" -F "email=candidate@example.com"
  -F "phone=+91 98765 43210" -F "graduation=2015" -F "gender=Prefer not to say" -F "experience=8" -F "employer=Example Ltd"
  -F "current_ctc=10" -F "expected_ctc=12" -F "notice=30" -F "source=Website" -F "current_location=Chennai"
  -F "preferred_location=Coimbatore" -F "skills=Teamcenter, ITK" -F "consent=1" -F "form_started=$OLD" -F "lang=en")

reset
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf"
check "valid application is accepted" 200 '"ok":true' "$STATUS" "$BODY"
assert "application writes exactly one mail" test "$(mails)" = 1
assert "application goes to the fixed recipient" grep -q '^To: info@thinkinnovnexgen.co.jp' <(last_mail)
assert "application names the whitelisted role" grep -q 'Role: Tech Lead - Teamcenter' <(last_mail)
assert "CV is attached under a generated file name" grep -q 'filename="cv-Test-Candidate.pdf"' <(last_mail)

reset
MINIMAL=(-F "first_name=Test" -F "last_name=Candidate" -F "email=candidate@example.com" -F "phone=+91 98765 43210"
  -F "graduation=2015" -F "experience=8" -F "employer=Example Ltd" -F "source=Website" -F "current_location=Chennai"
  -F "preferred_location=Coimbatore" -F "skills=Teamcenter, ITK" -F "consent=1" -F "form_started=$OLD" -F "lang=en")
post $PORT_OK apply.php json "${MINIMAL[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf"
check "application without gender, CTC and notice period is accepted" 200 '"ok":true' "$STATUS" "$BODY"
assert "optional fields left blank are mailed as not provided" bash -c "grep -q '^Gender: not provided' '$OUT'/*.eml && grep -q '^Current CTC (LPA): not provided' '$OUT'/*.eml && grep -q '^Expected CTC (LPA): not provided' '$OUT'/*.eml && grep -q '^Notice period (days): not provided' '$OUT'/*.eml"
reset
post $PORT_OK apply.php json "${MINIMAL[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf" -F "employer="
check "a required field left blank is still rejected" 400 '"code":"invalid"' "$STATUS" "$BODY"
assert "the rejected application sent no mail" test "$(mails)" = 0

reset
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf" -F "job=../../etc/passwd" -F "evil=should-not-appear" -F "to=attacker@example.com"
check "unknown role becomes a general application" 200 '"ok":true' "$STATUS" "$BODY"
assert "unknown role is not mailed" grep -q 'Role: General application' <(last_mail)
assert "unknown fields are not mailed" bash -c "! grep -q 'should-not-appear\|attacker@example.com' '$OUT'/*.eml"

reset
post $PORT_OK apply.php json "${APPLY[@]}"
check "missing CV is rejected" 400 '"code":"file_missing"' "$STATUS" "$BODY"
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.txt;type=application/pdf"
check "wrong extension is rejected" 400 '"code":"file_type"' "$STATUS" "$BODY"
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/fake.pdf;type=application/pdf"
check "wrong content behind a .pdf name is rejected" 400 '"code":"file_type"' "$STATUS" "$BODY"
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/big.pdf;type=application/pdf"
check "file over 5 MB is rejected" 400 '"code":"file_size"' "$STATUS" "$BODY"
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf" -F "graduation=abcd"
check "non-numeric graduation year is rejected" 400 '"code":"invalid"' "$STATUS" "$BODY"
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf" -F "website=x"
check "filled honeypot is rejected" 400 '"ok":false' "$STATUS" "$BODY"
assert "none of the rejected applications sent mail" test "$(mails)" = 0

# A DOCX is a zip container. A zip of something else renamed .docx is refused; a Word file is accepted.
python3 - "$WORK" <<'PY'
import sys, zipfile
work = sys.argv[1]
with zipfile.ZipFile(work + "/renamed.docx", "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("notes.txt", "not a document " * 50)
    z.writestr("run.sh", "#!/bin/sh\necho hello\n")
with zipfile.ZipFile(work + "/cv.docx", "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
    z.writestr("_rels/.rels", '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
    z.writestr("word/document.xml", '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Test CV</w:t></w:r></w:p></w:body></w:document>')
PY
reset
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/renamed.docx;type=application/vnd.openxmlformats-officedocument.wordprocessingml.document"
check "a zip of other files renamed .docx is rejected" 400 '"code":"file_type"' "$STATUS" "$BODY"
assert "and sends no mail" test "$(mails)" = 0
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.docx;type=application/vnd.openxmlformats-officedocument.wordprocessingml.document"
check "a Word document (.docx) is accepted" 200 '"ok":true' "$STATUS" "$BODY"
assert "and is attached under a generated file name" grep -q 'filename="cv-Test-Candidate.docx"' <(last_mail)

reset
for i in 1 2 3 4 5 6; do post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf"; done
post $PORT_OK apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf"
check "7th application in the window is rate limited" 429 '"code":"rate"' "$STATUS" "$BODY"

reset
post $PORT_FAIL apply.php json "${APPLY[@]}" -F "resume=@$WORK/cv.pdf;type=application/pdf"
check "mail failure is reported as failure" 500 '"code":"mail_failed"' "$STATUS" "$BODY"
reset

echo
echo "Passed: $PASS  Failed: $FAIL"
[ "$FAIL" = 0 ]
