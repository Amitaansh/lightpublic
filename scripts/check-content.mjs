// Public-content rules (AGENTS.md §5), checked over the site's copy.
// Fails on forbidden wording; warns on items the founders still have to confirm.
// Set STRICT=1 (for example before deploying) to turn the warnings into failures.

import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const files = []
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(e.name)) files.push(p)
  }
}
for (const d of ['content', 'components', 'app']) walk(path.join(root, d))

const FORBIDDEN = [
  [/red cross/i, 'partner name (Red Cross)'],
  [/\bSAVH\b/, 'partner name (SAVH)'],
  [/student accessibility/i, 'partner name (NUS Student Accessibility Unit)'],
  [/replaces? (the|your) (white )?cane/i, 'says it replaces the cane'],
  [/instead of (the|your) cane/i, 'says it replaces the cane'],
  [/\bstandalone\b|works without (the|a) cane/i, 'mentions standalone use'],
  [/\bcure[sd]?\b|guaranteed|100% safe|clinically/i, 'medical or absolute claim'],
]

const errors = []
const warnings = []
for (const f of files) {
  const rel = path.relative(root, f)
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      // Check strings and JSX text only, not comments.
      const code = line.replace(/\/\/.*$/, '').replace(/^\s*\*.*$/, '').replace(/\/\*.*?\*\//g, '')
      const strings = code.match(/(['"`])(?:\\.|(?!\1).)*\1|>[^<>{}]+</g) ?? []
      for (const s of strings) for (const [re, why] of FORBIDDEN) if (re.test(s)) errors.push(`${rel}:${i + 1}  ${why}: ${s.trim().slice(0, 90)}`)
    })
}

const read = (p) => readFileSync(path.join(root, p), 'utf8')
const unchecked = (read('content/stats.ts').match(/checked: null/g) ?? []).length
if (unchecked) warnings.push(`content/stats.ts: ${unchecked} market figure(s) not yet re-checked against their source`)
const unconfirmed = (read('content/milestones.ts').match(/confirmed: false/g) ?? []).length
if (unconfirmed) warnings.push(`content/milestones.ts: ${unconfirmed} milestone(s) not yet confirmed by the founders`)
if (/draft: true/.test(read('content/about.ts'))) warnings.push('content/about.ts: "Why we started" is still a draft; replace it with the founders’ own words')
if (/prototypeUrl: null/.test(read('content/site.ts'))) warnings.push('content/site.ts: prototype URL not set; the site says the link is coming soon')

for (const w of warnings) console.warn('warn ', w)
for (const e of errors) console.error('error', e)
if (errors.length || (process.env.STRICT === '1' && warnings.length)) {
  console.error(`\nContent check failed: ${errors.length} error(s), ${warnings.length} warning(s).`)
  process.exit(1)
}
console.log(`Content check passed (${files.length} files; ${warnings.length} item(s) to resolve before publishing).`)
