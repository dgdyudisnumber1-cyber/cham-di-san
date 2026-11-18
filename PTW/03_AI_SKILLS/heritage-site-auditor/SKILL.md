---
name: heritage-site-auditor
description: "Audit pages and functions of the Cham Di San website after migration from Readdy to GitHub and Netlify. Use for route inventories, checking rendering, missing functionality, or verifying live vs mock content."
---

# Heritage Site Auditor

## Scope and expected output

Input: repository or site URL and expected pages. Output: route matrix, evidence log, actionable defects.

## Procedure

1. List all routes from src/router/config.tsx and screen components; label static, data-backed, and authentication routes.
2. Inspect data fetches from src/lib/supabase.ts and classify each dependency as current or unverified.
3. Test every navigable route and hard-refresh deep links; log exact URL, expected and observed state.
4. Check desktop/mobile, image loads, console exceptions, network 4xx/5xx, and CTA actions.
5. Never claim that a static mock card proves Supabase connectivity.
6. Produce PASS/PARTIAL/FAIL/BLOCKED matrix and top five minimal fixes; do not modify production without approval.

## Evidence and quality gate

- Read `references/project-context.md` for project-specific sources.
- Mark each important statement VERIFIED, INFERRED, or UNVERIFIED.
- Never claim to have accessed social analytics or live Readdy backend without evidence.
- Preserve source links for any externally sourced factual assertions.
- Provide result in Vietnamese unless the user requests another language.
- Protect personal data, confidential exports and credentials; do not upload them into social posts, GitHub or public slides.
