# Audit notes from the receiving project (2026-11-03)

The external SQL ZIP was inspected separately from the Readdy project source.
Its counts explain the apparent disagreement in earlier migration notes:

| Exported entity | SQL rows |
|---|---:|
| 17 public application tables | 54 |
| `auth.users` | 4 |
| `auth.identities` | 4 |
| `auth.mfa_factors` | 0 |
| **Total** | **62** |

The Readdy Backend also reports two empty Storage buckets. These bucket
objects were NOT part of the 62-row data export, and counting them does not
make a database restore more complete.

Use `assets_manifest.json` as the authoritative image inventory (45 unique
images / 57 reference points), not the previous estimate of 31 images in
`04-storage-assets.md`.

`02-rls-grants.sql`: sections 1-3 describe original RLS/policies/grants; section
4 is a proposed patch and was not applied to the live backend. Do not apply it
without reviewing what each statement does. The patch is not a complete fix
for every order/storage authorization risk.

No backed-up image bytes or private SQL data are bundled in this GitHub-ready
starter. The 62-row original SQL ZIP must be kept privately, separately.
