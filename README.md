# Customer directory

Implementation of the [Juntos Somos Mais frontend challenge](https://github.com/juntossomosmais/frontend-challenge). The first iteration prioritized the required functionality and used the supplied layout as a reference. Subsequent participant-requested enhancements include motion, dark mode and an English language option. Brazilian Portuguese remains the default language.

## Run locally

Use Node.js 24.15+ within the 24.x line (recommended), 22.22.2+ within the 22.x line, or 26+, and npm. These versions satisfy the application and test-tool requirements.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

```sh
npm test
npm run build
npm run preview
```

## Features

- Switch between customer cards (name, photo and address) and a compact list (photo, name and address). Both views link to customer details.
- First-name / surname search, ignoring case and accents; multiple words can be combined.
- A separate phone search matches full or partial phone/mobile numbers, ignoring formatting, and combines with name/state filters.
- One or several Brazilian state filters, combined with the search.
- Choose 9, 33 or 99 customers per page, with previous/next controls and a page selector. Changing the page size returns to the first page.
- Dedicated detail URLs with contact and address information.
- Name and phone searches, state selection, page, page size and display mode are stored in the URL and preserved by the detail page's return link. Clearing filters retains page size and display mode.
- Loading, empty results, request errors with retry, unknown routes, and image fallback.
- Responsive layout, native controls, keyboard focus styles, skip link and labelled fields.
- Optional motion: short card/detail entrance, pointer hover and press feedback, search focus and selected-filter highlights. Movement is disabled with `prefers-reduced-motion`; hover movement applies only to fine pointers that support hover.
- Light, blue-gray and dark (neutral gray) visual theme switch with three color samples and Portuguese/English selector in the header. Preferences are saved locally, with the system color scheme used on the first visit. Settings still work for the current visit if storage is blocked. Customer names, addresses and Brazilian state names retain their original spelling.

## Data and scope

The application requests `/api/customers`, which forwards the company's JSON endpoint at runtime. Direct browser access failed because the upstream response has no `Access-Control-Allow-Origin` header. Vite provides this fixed proxy during development; `server.mjs` serves both the production build and the same fixed upstream in preview. The task explicitly allows an intermediary layer. Internet access is needed for data and photos. No API key or paid service is required.

The application does not silently substitute a local dataset after a failed request. `reference/customers.json` is an unchanged snapshot for reproducible tests, not a runtime fallback. There are 200 records and 27 states in the snapshot downloaded on 2026-09-26.

Search applies within the selected states. Multiple selected states are combined with OR. Changing either search field or the states resets pagination. A repeated email causes dataset validation to fail rather than making detail links ambiguous. Email serves as the record ID for this supplied dataset because the source has no explicit ID and its emails are unique. The detail view deliberately displays only contact/address fields rather than interpreting potentially inconsistent sample ages or coordinates.

The stack is React, React Router and Vite, with plain CSS and a small Node server for data forwarding. Hash-based URLs allow detail pages to survive reloads without server rewrite rules. Hosting requires Node (or an equivalent same-origin proxy); uploading `dist` alone to a static host is not sufficient for the data route. The local server binds to localhost. There is no authentication, editing or persistence of customer changes: these are outside the mandatory task.

## Tests

Vitest and Testing Library exercise the actual supplied dataset and UI journeys. The 19 tests cover search, combined filtering, page boundaries, duplicate/invalid payloads, empty responses, loading/retry, detail links, return-state preservation, broken images, language/theme persistence and unavailable browser storage. Network responses are mocked in component tests so the tests do not depend on the remote server.

## Files

- `src/` — application and tests.
- `public/` — original company logo, emblem favicon and asset provenance.
- `reference/` — original brief, license, layout and dataset snapshot.
- `ai-journey/` — actual prompts, implementation decisions and verification notes.
- `TASK.md` — plain-language task overview in English.
- `REQUIREMENTS-AUDIT.md` — requirement mapping, verification and known limits.

## Submission status

The participant reviewed and directed iterative UI refinements, provided the reflection in `ai-journey/learnings.md`, and authorized publication and submission. The required delivery is a public GitHub repository and an Issue in the challenge repository. The Issue form also requests full name, email, LinkedIn and GitHub profile; a live demo is optional. Submission is complete only once the repository and Issue exist. Source materials retain their original MIT notice in `reference/LICENSE`.
