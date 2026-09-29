# Selected prompts and outcomes

Tool: Codex. The conversation took place in Russian; participant quotations below are translated into English. This is a selection of meaningful requests, not a full transcript. The participant directed priorities and reviewed the interface; Codex authored implementation, tests and documentation.

## Choosing the exercise

Participant: “First, look for an openly available test assignment. Once we complete it, we can discuss the job attached to it.” After seeing this challenge: “This option is worth trying.”

Outcome: the original brief, layout, license and dataset were downloaded, and a plain-language explanation was prepared before implementation.

## Mandatory features first

Participant: “First we need to meet the mandatory requirements. After that we can try being creative.”

Outcome: customer cards, name search, state filters, pagination, customer details, tests and documentation. React, React Router, Portuguese as the initial UI language and the data-proxy architecture were assistant implementation choices, not technologies independently selected or implemented by the participant.

## Verification changed data loading

The initial direct browser request failed because the upstream response lacked the cross-origin permission header. Mocked component tests had not exposed this. Codex replaced it with a same-origin `/api/customers` proxy to the specified endpoint. The challenge permits this intermediary. A subsequent live-browser check passed.

## Animations and micro-interactions

After discussing optional items, the participant said: “Let's start with the first item. Can you add it?”

Outcome: card/detail entrance animations, hover/press feedback, search focus and selected-filter highlights without another library. Reduced-motion preferences are respected and hover movement is limited to fine pointers.

## Dark mode and English

Participant: “Now add a dark theme and the option to switch to English.”

Outcome: centralized Portuguese/English text, theme variables and saved preferences, including loading, error, empty and detail states, accessible labels and metadata. Customer names and addresses retain their source spelling.

## Three palettes

Participant: “Make this theme a little lighter to become the medium theme. Keep light as it is, and make dark a standard dark theme rather than dark blue.”

Outcome: unchanged light palette, brighter blue-gray palette and neutral dark palette. A later request renamed Medium after its color: Blue-gray.

## Phone search and aligned search fields

Participant: “Rename Medium after the theme color. Add a phone-number filter as another search field.” Then: “Put the phone and name search fields in one row instead of stacking them.”

Outcome: full or partial phone/mobile matching that ignores formatting, combines with name/state filters and is stored in the URL. The fields share a row on wider screens and stack on narrow ones. Matching rules and the breakpoint were assistant implementation choices.

## Page size and list view

Participant: “Add a choice of 9, 33 or 99 customers per page and a list display with customer name and address.”

Outcome: page-size/display selectors, clickable list rows and URL state. Changing page size returns to page one; changing display mode preserves the page. Clearing filters retains display settings.

## Visual refinement and branding

The participant requested list photos, a visual theme switch without a visible Theme label, restored alignment, a compact result counter, and a company logo and favicon.

Outcome: shared avatars, three accessible color-swatch radio controls and one toolbar above aligned filters and results. The logo came from the challenge README; asset provenance is recorded in `public/ASSETS.md`.

## Requirements audit

Participant: “Check carefully whether all the main requirements are met, and what additional ones remain.”

Outcome: Codex checked the upstream brief, source, 19 tests, production build, live API and controlled browser error cases. It corrected stale documentation and Node requirements. Sorting remains unimplemented; full screen-reader and performance audits have not been conducted.

## Reflection and submission preparation

The participant checked the original flow diagram, supplied the reflection in `learnings.md`, requested English reports and authorized publication/submission if the work was sufficient.

The required flow remains API → data loading → customer directory with search, state filters and pagination → customer details. Reports were translated and private attachments and temporary files excluded from publication. The actual Issue template revealed required identity/contact/profile fields beyond the README instructions; these values must come from the participant.
