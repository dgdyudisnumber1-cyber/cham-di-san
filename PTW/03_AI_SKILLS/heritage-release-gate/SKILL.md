---
name: heritage-release-gate
description: "Verify Cham Di San readiness for short-term public deployment from GitHub to Netlify with a Readdy or Supabase backend. Use before releases, migration cutover and deployment troubleshooting."
---

# Heritage Release Gate

## Scope and expected output

Input: repository commit, Netlify deploy URL and public env variable presence. Output: release gate.

## Procedure

1. Confirm package dependencies install and Vite build emits out/ according to netlify.toml.
2. Check no .env, SQL auth exports, passwords or sensitive contact records were committed.
3. Verify backend URL from environment without printing key values; inspect browser network errors.
4. Test React Router deep links, 12-location listing, stories, account, favorite and contact smoke tests.
5. Check 45 manifest images or explicitly note missing copies and remote dependency.
6. Decide GO, CONDITIONAL GO or NO-GO with specific blockers and rollback steps.

## Evidence and quality gate

- Read `references/project-context.md` for project-specific sources.
- Mark each important statement VERIFIED, INFERRED, or UNVERIFIED.
- Never claim to have accessed social analytics or live Readdy backend without evidence.
- Preserve source links for any externally sourced factual assertions.
- Provide result in Vietnamese unless the user requests another language.
- Protect personal data, confidential exports and credentials; do not upload them into social posts, GitHub or public slides.
