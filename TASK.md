# Customer directory — task overview

This overview was translated into English at the participant's request.

Source: https://github.com/juntossomosmais/frontend-challenge
Original materials were downloaded on September 26, 2026. See `reference/README.md` and `reference/LICENSE`.

## Input

The source is a public JSON endpoint containing 200 sample customer records, including names, addresses, states, contact details and photo URLs. `reference/customers.json` is a test snapshot, not a runtime fallback. `reference/layout-jsm.png` is a starting-point layout that the task permits participants to redesign.

## Required result

Build a customer directory with cards, first/last-name search, Brazilian state filtering, pagination and an internal detail page. Tests are welcomed and form part of the evaluation. AI collaboration and the three `ai-journey` documents are mandatory.

The company evaluates functionality, edge cases, architecture, readable code, testing, UI/UX, performance and transparent, informed AI collaboration.

## Scope and current state

The required functions and several participant-requested improvements have been implemented. The original flow diagram is preserved. The participant directed iterative UI refinements and supplied a reflection proposing a broader workspace as a future direction; that workspace has not been implemented.

Data is loaded from the real endpoint via a fixed same-origin proxy because direct browser access lacks cross-origin permission. No paid service or API key is required.

See `README.md` for setup and `REQUIREMENTS-AUDIT.md` for verification and limitations.

## Submission

Publish a public GitHub repository and submit an Issue to the company. The actual template also requires name, email, LinkedIn and GitHub profile, plus summaries and checklist confirmations. A live demo is optional. The participant has authorized submission; completion is only confirmed by the resulting repository and Issue URLs.

The company maintains a talent pool and does not guarantee a current vacancy, response time, payment or employment.
