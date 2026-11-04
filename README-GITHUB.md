# Cham Di San: GitHub / Codespaces / Netlify starter

This package is the Readdy-exported Vite + React + TypeScript frontend, with
GitHub/Codespaces configuration and an optional image backup tool. It does NOT
contain the private SQL data export, saved photos, or live Backend credentials.

## Fastest path for a 15-30 day deployment (option A)

1. Upload this project to a **private** GitHub repository.
2. Open **Code > Codespaces > Create codespace**. The devcontainer uses Node 22.
3. In the terminal, run:

   ```sh
   cp .env.example .env
   ```

   Copy the two actual public connection variables (`VITE_PUBLIC_SUPABASE_URL`
   and `VITE_PUBLIC_SUPABASE_ANON_KEY`) from the `.env` in your ORIGINAL ZIP.
   Keep `.env` out of Git. Never put `service_role`, passwords, or auth SQL in Git.
4. Run `npm install` if the automatic install did not finish, then `npm run dev`.
   Open forwarded port 3000.
5. In the browser, test the homepage, list/detail pages, login, favorites, and
   submit/contact actions. Use a disposable test account and test data for writes.
   Check Developer Tools > Network for blocked CORS requests.
6. If the browser works, connect the GitHub repository to Netlify: build command
   `npm run build`, publish directory `out`, and set the same two `VITE_*`
   environment variables on Netlify. The included `netlify.toml` handles React
   Router deep links (`/location/...`, `/auth/callback`, etc.).
7. DO NOT unpublish the original Readdy site until the new deployment has been
   tested and you have a database backup.

The runtime remains dependent on Readdy Backend. Its CORS policy, life after
unpublish, email authentication redirects, and the AI widget are NOT proven to
work on an external domain.

## Back up the 45 external images

All 45 URLs and their 57 reference points are in
`docs/migration/assets_manifest.json`. To view current local coverage:

```sh
python3 scripts/backup_assets.py
```

To download in parallel (requires internet):

```sh
python3 scripts/backup_assets.py --download
```

On Windows with Python installed, use `py scripts/backup_assets.py --download`.

Successful images go into `public/assets/...`, and
`src/lib/downloaded-asset-map.json` is regenerated automatically. All image
components now use `assetUrl()` so that a locally downloaded image is used
instead of the old URL, including images read dynamically from Supabase.
The 42 Readdy-generated images can also be matched by their `seq` query value,
so different URL encodings in SQL and source code do not break the mapping.

If a download fails, the original external URL remains the fallback. The report
in `docs/migration/assets-download-report.json` identifies successes/failures.
Commit the downloaded `public/assets` files and the generated map to GitHub.

The image links could include third-party material. Confirm reuse rights before
redistributing. This script does not modify the old Readdy Backend or SQL dump.

## Alternative: own Supabase Backend (option B)

Use your SEPARATE SQL export and the existing `docs/migration/` guides to set
up 17 public tables and Auth in a new Supabase project. Do not upload user data,
password hashes, contact records or the original SQL ZIP to a public repository.
Update the `.env` variables for the new Supabase project. The image backup above
works with either option because it replaces URLs in the browser, without
requiring UPDATE commands in SQL.

## Useful commands

```sh
npm install
npm run dev
npm run type-check
npm run build
npm run preview
```

Vite is set to port 3000 and build output `out/`. The project currently has no
`package-lock.json`: the first successful `npm install` should generate one.
Commit that lockfile to make future installs consistent.

For GitHub Pages at a project subpath, the Vite config already supports a
`BASE_PATH` environment variable. However, browser-history routes need a
separate 404 fallback. Netlify is the simpler path and is the deployment target
for this starter configuration.

## Verification status

- Audited: source structure, 45 unique external URLs, 57 references, image
  fallback integration, asset-download tool syntax, GitHub/Netlify configs.
- Not verified here: npm package install, production build, live HTTP requests,
  Readdy CORS, image downloads, and email flows (network was unavailable).
- The original SQL ZIP held 54 public rows, 4 `auth.users` rows and 4
  `auth.identities` rows, or 62 INSERT rows in total. Two storage buckets are
  separate metadata, not two user records.
