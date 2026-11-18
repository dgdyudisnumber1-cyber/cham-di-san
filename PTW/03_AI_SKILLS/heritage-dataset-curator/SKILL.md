---
name: heritage-dataset-curator
description: "Curate and validate the Cham Di San public editorial SQL export into traceable CSV and JSON datasets. Use to update heritage articles, locations, stories, and artisan records without leaking user or contact data."
---

# Heritage Dataset Curator

## Scope and expected output

Input: SQL export and schema. Output: cleaned public datasets, counts, data dictionary, rejected rows.

## Procedure

1. Classify every SQL table by public editorial, user-generated, auth, or contact sensitivity.
2. Exclude auth.users, auth.identities, contacts, contributions, and transactional user details from shareable exports.
3. Parse SQL literals without losing Unicode, apostrophes, NULL, or nested text.
4. Validate key uniqueness, required slugs, location references and basic published dates.
5. Preserve original source files separately; never overwrite them during cleaning.
6. Publish record counts and manifest hashes; flag disagreements rather than inventing rows.

## Evidence and quality gate

- Read `references/project-context.md` for project-specific sources.
- Mark each important statement VERIFIED, INFERRED, or UNVERIFIED.
- Never claim to have accessed social analytics or live Readdy backend without evidence.
- Preserve source links for any externally sourced factual assertions.
- Provide result in Vietnamese unless the user requests another language.
- Protect personal data, confidential exports and credentials; do not upload them into social posts, GitHub or public slides.
