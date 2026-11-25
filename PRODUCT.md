# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and technically comfortable desktop users evaluating Joont's self-made software. They arrive to understand what each project does, inspect real interface screenshots, check platform support, and download the current release or open its source.

## Product Purpose

JT Products Index is a static index of software made and used by one person. It explains each project's purpose, shows its real interface, and gives visitors a direct route to the latest release or repository. Success means a visitor can identify the relevant project and reach its usable artifact without creating an account.

## Positioning

An independent product and experiment index for local-first software. The site treats real working artifacts as evidence and is designed to accept future projects beyond desktop applications without forcing every project into a desktop-window presentation.

## Operating Context

Visitors compare projects, inspect screenshots, check supported platforms and data behavior, and then download a release or read source code. The site is static, hosted on GitHub Pages, and has no backend, accounts, tracking, or cloud storage.

## Capabilities and Constraints

- Current projects are Work Station and Something, both desktop applications.
- Content is sourced from `src/data/products.ts`; releases and source links point to GitHub.
- Future entries may be desktop apps, web apps, mobile apps, libraries, or experiments.
- Each project needs a consistent name, one-line description, type, status, year, and primary entry point.
- Product-specific previews must be able to use a desktop window, browser frame, phone frame, code/terminal presentation, or authored image.
- The site uses Astro static output, native CSS, and a small amount of inline JavaScript for theme switching, mobile navigation, and screenshot lightbox behavior.

## Brand Commitments

- Name: JT 出品.
- Chinese is the primary interface language.
- Voice: direct, practical, and personal; no growth-hype language.
- Durable statement: 能自己用，才值得做。
- The site presents one person's work, not an agency or venture-backed SaaS brand.
- The redesign direction approved by the user is an independent product lab with index capability.

## Evidence on Hand

- Real product screenshots live under `src/assets/shots/`.
- Product facts, features, metrics, platform support, downloads, and source links live in `src/data/products.ts`.
- Project documentation and build/deploy instructions live in `README.md`.
- There are no testimonials, customer logos, usage benchmarks, or commercial claims. Future work must not invent them.

## Product Principles

1. Show working artifacts before making claims.
2. Keep the index legible as the number and type of projects grows.
3. Let each project's medium shape its preview while keeping one shared system.
4. Prefer direct access to a release, source, or usable project.
5. Keep privacy and local-first behavior visible and factual.

## Accessibility & Inclusion

The redesigned site must preserve keyboard access, visible focus states, skip navigation, semantic landmarks, readable contrast, responsive layouts without horizontal scrolling, and an accessible screenshot lightbox.
