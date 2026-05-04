// Format AI review JSON ke markdown comment Bahasa Indonesia.
// Input: env AI_RESPONSE (string), PR_HEAD_SHA (full sha).
// Output: markdown ke stdout.

const raw = process.env.AI_RESPONSE || '';
const sha = (process.env.PR_HEAD_SHA || '').slice(0, 7);

function nowJakarta() {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  return `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function extractJson(s) {
  let t = s.trim();
  // Strip ```json ... ``` or ``` ... ```
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) t = fence[1].trim();
  // Fallback: ambil substring dari '{' pertama sampai '}' terakhir
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first >= 0 && last > first) t = t.slice(first, last + 1);
  return t;
}

let issues = [];
try {
  const parsed = JSON.parse(extractJson(raw));
  if (Array.isArray(parsed.issues)) issues = parsed.issues;
} catch (e) {
  console.error('Gagal parse JSON dari AI:', e.message);
  console.error('Raw response:\n', raw);
}

const allowed = new Set(['critical', 'high']);
const filtered = issues.filter(i => i && allowed.has(String(i.severity).toLowerCase()));

const header = `# Code Review ${sha} ${nowJakarta()}\n`;

if (filtered.length === 0) {
  process.stdout.write(`${header}\nTidak ditemukan issue critical/high pada commit ini.\n`);
  process.exit(0);
}

const groups = { critical: [], high: [] };
for (const i of filtered) groups[String(i.severity).toLowerCase()].push(i);

function renderGroup(label, list) {
  if (list.length === 0) return '';
  let out = `\n## ${label}\n`;
  list.forEach((i, idx) => {
    const file = i.file || '(file tidak diketahui)';
    const line = i.line ? `:${i.line}` : '';
    const title = i.title || 'Tanpa judul';
    const reason = i.reason || '-';
    const fix = i.fix || '-';
    out += `\n### ${idx + 1}. ${title}\n\n`;
    out += `* \`${file}${line}\`\n`;
    out += `* ${reason}\n`;
    out += `* ${fix}\n`;
  });
  return out;
}

let body = header;
body += renderGroup('CRITICAL ISSUE', groups.critical);
body += renderGroup('HIGH ISSUE', groups.high);

process.stdout.write(body);
