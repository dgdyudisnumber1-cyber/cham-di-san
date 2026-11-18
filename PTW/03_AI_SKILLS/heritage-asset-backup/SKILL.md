---
name: heritage-asset-backup
description: "Inventory and back up Cham Di San remote images referenced by SQL and React code. Use when Readdy assets may disappear, changing hosting, or auditing media completeness."
---

# Heritage Asset Backup

## Scope and expected output

Input: docs/migration/assets_manifest.json and project source. Output: verified local assets, map, report.

## Procedure

1. Read all manifest assets; deduplicate by canonical identity but retain every original reference.
2. Use scripts/backup_assets.py --download only when connectivity and usage rights permit.
3. Validate file signatures and reject HTML error responses masquerading as images.
4. Write public/assets files and downloaded-asset-map.json preserving URL and seq matches.
5. Never overwrite originals; report count, failed URL, status, and legal reuse concerns.
6. Ensure production build references local files after download and contains no unresolved assets unless justified.

## Evidence and quality gate

- Read `references/project-context.md` for project-specific sources.
- Mark each important statement VERIFIED, INFERRED, or UNVERIFIED.
- Never claim to have accessed social analytics or live Readdy backend without evidence.
- Preserve source links for any externally sourced factual assertions.
- Provide result in Vietnamese unless the user requests another language.
- Protect personal data, confidential exports and credentials; do not upload them into social posts, GitHub or public slides.
