# AI collaboration log

The participant defined priorities, evaluated the interface and directed revisions. Codex authored the code, tests and technical documentation. The participant's own reflection is recorded separately in `learnings.md`; this log does not claim that they independently implemented or mastered the code.

## 2026-09-26 — Selection and preparation

The participant asked for a publicly accessible hiring exercise that permits AI collaboration, then chose the Juntos Somos Mais customer directory. The assistant downloaded the brief, MIT license, reference layout and 200-record dataset, and prepared a Russian explanation because the discussion is in Russian.

The participant's preferred process is to choose the direction themselves, with the assistant helping investigate and verify rather than deciding the approach in advance.

## 2026-09-26 — Baseline implementation

The participant explicitly chose to complete the mandatory requirements before exploring creative changes. The assistant then authored the implementation and tests using Codex.

Implementation choices made by the assistant:

- React, React Router, Vite, plain CSS, Portuguese interface matching the reference.
- Nine cards per page; query, selected states and page in the URL.
- Contact/address fields on the detail page; email as a unique identifier for this dataset.
- Explicit loading, empty and error states, retry and photo fallback.
- A fixed data proxy after an actual browser check exposed the source's missing cross-origin permission.

These are assistant implementation decisions, not claims that the participant independently wrote or already understands the code. The participant's review and any subsequent decisions are still pending.

## Verification performed by the assistant

- 13 Vitest / Testing Library tests passed, including source-data and user-journey tests.
- Production build succeeded.
- A headless Edge check against the built application loaded the live source through the proxy and exercised search, filters, first/last pages, detail-page reload and preservation of filters on return.
- Screenshots were inspected at desktop and 390px mobile widths; no horizontal overflow or page JavaScript errors were observed in that browser check.

The project remains local. Nothing has been submitted to the company or published on GitHub.

## Optional item 1 — participant-authorized enhancement

The participant chose the first optional item: animations and micro-interactions. The assistant implemented restrained CSS feedback for cards, buttons, search and filter selection, with reduced-motion support. Other optional features remain outside this change.

## Dark theme and English — next participant request

The participant then explicitly requested dark mode and English switching. The assistant implemented both, with saved settings and translated interface states. All 15 automated tests and the build passed. A browser check verified switching on list/detail pages, reload persistence, focus preservation, first-visit system theme and layouts at 390px and 320px. Desktop/mobile screenshots of both palettes were inspected after finishing animations.

## 2026-09-28 — Three theme choices

The participant requested a brighter version of the blue-gray palette as a medium theme, an unchanged light palette and a neutral dark palette. The assistant implemented the three choices and updated preference persistence and the pre-paint script. All 15 tests and the production build passed. A browser check with the reference dataset verified all three palettes after reload, preserved pagination, switching on the detail page, translated controls and no horizontal overflow at 320px. Medium/dark desktop screenshots and the medium mobile screenshot were inspected; no JavaScript errors were observed.

## Color-based name and phone filter

The participant requested a color name for Medium and a second search field for telephone numbers. The assistant implemented Blue-gray / Azul-acinzentada and a combined phone/mobile filter. All 17 tests passed, including formatted/partial numbers, missing numbers, combined filters, pagination reset, detail return and clearing searches. The production build succeeded. A browser check using the reference dataset verified phone/mobile matches, reload persistence, the new theme label and the translated input at 320px without horizontal overflow; the mobile screenshot was inspected.

## Page size and list view

The participant requested 9/33/99 items per page and a list showing names and addresses. The assistant implemented both. All 19 tests and the build passed, including full-dataset pagination for every supported size, invalid-size fallback, combined filters and detail-return behavior. Browser checks verified actual 9/33/99 item counts, the final page, switching views, reload persistence and no horizontal overflow at 320px. Desktop and mobile screenshots were inspected.

## Visual refinements and original logo

The participant requested list photos, visual theme choices, aligned blocks, a smaller result counter and the company's logo/favicon. The assistant implemented these changes and documented the original logo source in `public/ASSETS.md`. All 19 tests and the build passed. Browser checks confirmed list avatars, loaded logo and favicon, aligned top edges of the filters and first result, keyboard theme switching, and a 320px layout without horizontal overflow. Desktop and mobile screenshots were inspected.

## 2026-09-29 — Requirements audit

The participant requested a thorough requirements check and remaining optional items. The assistant compared the current upstream brief with the implementation, reran all 19 tests and the build, and checked both the live API and controlled failure/empty/invalid cases in Edge. Both views and three themes were checked at four viewport widths. The audit corrected stale documentation and the documented Node minimum, and distinguished implemented functions from unfinished submission steps and the participant's own pending reflections. Details and limitations are in `REQUIREMENTS-AUDIT.md`; no new optional feature or external submission was made.

## 2026-09-29 — Reflection and English submission materials

The participant supplied a reflection proposing a broader workspace with workflows and dedicated client pages as a future direction. The assistant translated it faithfully, distinguished this idea from implemented functionality, and confirmed that the original API-to-directory-to-details flow is retained. The participant requested all reports in English and authorized publication/submission. The assistant translated the remaining reports and prepared a submission draft. Inspecting the actual Issue template revealed required identity and profile fields absent from the README's short submission instructions. The assistant requested those values rather than inventing them. Repository publication and Issue creation must be confirmed separately by their resulting URLs.
