# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static, single-page wedding invitation website built with vanilla HTML, CSS, and JavaScript — no framework, no build step, no package manager. Open `index.html` directly in a browser to run it.

## Development

No build, lint, or test commands exist. To preview changes, open `index.html` in a browser (or use a local static server like `npx serve .` or VS Code Live Server).

## Architecture

### Data-driven rendering via `WEDDING` config

All wedding content is centralized in a single `WEDDING` constant at the top of `scriptwd.js`. The HTML in `index.html` contains only structural skeleton elements with data-attributes or empty containers; `scriptwd.js` reads from `WEDDING` and populates every visible section on `DOMContentLoaded`. To change names, dates, venues, RSVP links, dress code, recommendations, or shared media links — edit only `WEDDING` in `scriptwd.js`, not the HTML.

### Section model

The page is composed of 7 full-viewport sections with CSS scroll-snapping (`scroll-snap-type: y mandatory`). Each section has a unique `id` that maps to:
- A dot indicator in the lateral nav (`#section-dots`)
- A desktop nav link
- A mobile menu item (with emoji icon)

Navigation (dots, arrows, desktop links, mobile menu) all resolve to `scrollIntoView()` calls on these section IDs. When adding a new section, register it in all four nav surfaces.

### Personalized guest greeting

The page reads a `?guest=Name` URL query parameter and injects the guest name into the hero greeting. This is the only dynamic runtime input; no backend or form submission is handled client-side beyond linking out to an external RSVP form (`WEDDING.rsvp.formLink`).

### Asset convention

Images live in `assets/`. The decorative rose frame (`rosas.png`) is injected programmatically into every section by `scriptwd.js` — it is not referenced in HTML. The `WEDDING.audioSrc` field is `null` by default; setting it to a file path enables an audio toggle button.
