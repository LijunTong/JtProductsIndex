---
name: JT 出品 · 产品与研究索引
description: A neutral independent product lab where real project artifacts lead the index.
colors:
  brand-blue: "#2457d6"
  brand-blue-strong: "#1944b4"
  brand-blue-soft: "#e8eefc"
  cool-ground: "#f3f5f6"
  surface: "#ffffff"
  muted-surface: "#e9edf0"
  ink: "#14181d"
  muted-ink: "#58616b"
  faint-ink: "#626b75"
  border: "#d9dfe4"
  border-strong: "#bcc5ce"
  success: "#137a57"
  success-soft: "#e5f2ed"
  violet-project: "#6556d9"
  teal-project: "#0e7657"
  code-bar: "#1b222b"
  code-bar-border: "#2c3540"
  code-text: "#dbe5ef"
  code-muted: "#91a0af"
  code-accent: "#7dd3b0"
  dark-ground: "#101418"
  dark-surface: "#171c21"
  dark-ink: "#f1f4f6"
  lightbox-overlay: "rgba(8, 12, 16, 0.78)"
typography:
  display:
    fontFamily: "Segoe UI Variable Display, Segoe UI, Noto Sans SC, PingFang SC, Microsoft YaHei UI, sans-serif"
    fontSize: "clamp(2.35rem, 4.5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "0em"
  headline:
    fontFamily: "Segoe UI Variable Display, Segoe UI, Noto Sans SC, PingFang SC, Microsoft YaHei UI, sans-serif"
    fontSize: "clamp(1.8rem, 2.8vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.14
    letterSpacing: "0em"
  body:
    fontFamily: "Segoe UI Variable Text, Segoe UI, Noto Sans SC, PingFang SC, Microsoft YaHei UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  label:
    fontFamily: "Cascadia Code, SFMono-Regular, Cascadia Mono, JetBrains Mono, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0em"
  display-studio:
    fontSize: "clamp(2.35rem, 3.3vw, 3.35rem)"
    fontWeight: 700
    lineHeight: 1.08
  product-title:
    fontSize: "clamp(2.8rem, 5.2vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1
  project-index-title:
    fontSize: "clamp(2rem, 3vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.04
  product-tagline:
    fontSize: "clamp(1.2rem, 2vw, 1.5rem)"
    fontWeight: 650
    lineHeight: 1.45
  title-lg:
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.1
  title-md:
    fontSize: "1.2rem"
    fontWeight: 650
    lineHeight: 1.45
  title-sm:
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
  body-lg:
    fontSize: "1.0625rem"
    fontWeight: 650
    lineHeight: 1.5
  body-md:
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.35
  body-sm:
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
  body-compact:
    fontSize: "0.9063rem"
    fontWeight: 400
    lineHeight: 1.7
  ui-sm:
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
  label-md:
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.5
  label-sm:
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  hairline: "1px"
  mark: "2px"
  focus: "3px"
  tag: "4px"
  sm: "6px"
  md: "8px"
  phone-inner: "16px"
  phone: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "clamp(64px, 7vw, 96px)"
components:
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "0 17px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 17px"
    height: "44px"
  status-tag:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  project-preview:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  feature-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "20px"
---

# Design System: JT 出品 · 产品与研究索引

## Overview

**Creative North Star: "The Product Workbench"**

The site is a working index, not a promotional shell. It presents a maker's real software on a cool neutral surface, then uses product-specific color only where it identifies a project. A compact studio rail establishes authorship; the project index does the actual work.

The visual system deliberately replaces the previous warm-paper editorial mood. It also avoids the generic SaaS hero: no repeated eyebrow labels, no equal feature-card wall as the page structure, and no single desktop-window metaphor imposed on every future project.

**Key Characteristics:**

- Cool neutral ground with a saturated electric-blue brand signal.
- Real project interfaces are the primary imagery and evidence.
- Product type controls the preview shell; the global shell stays platform-neutral.
- One-pixel rules, restrained radii, and dense but scannable metadata.
- Light and dark themes use the same hierarchy and spacing.

## Colors

The palette is restrained at the site level and product-led inside artifacts.

### Primary

- **Workbench Blue** (`#2457d6`): Primary actions, focus rings, brand mark, selection, and the active theme control.
- **Workbench Blue Deep** (`#1944b4`): Primary button hover and darker emphasis.
- **Workbench Blue Wash** (`#e8eefc`): Quiet brand-tinted surfaces; never used as the whole page ground.

### Secondary

- **Work Station Violet** (`#6556d9`): Work Station preview chrome, project links, and data markers.
- **Something Teal** (`#0e7657`): Something preview chrome, project links, and data markers.
- **Published Green** (`#137a57`): Status labels only. It is not a competing brand color.
- **Terminal Navy** (`#1b222b`): Code preview chrome and terminal fields.
- **Terminal Mint** (`#7dd3b0`): Code prompt accent only.

### Neutral

- **Cool Ground** (`#f3f5f6`): Page background in light mode.
- **Surface White** (`#ffffff`): Cards, dialogs, screenshot chrome, and content fields.
- **Muted Ground** (`#e9edf0`): Utility bands and secondary controls.
- **Workbench Ink** (`#14181d`): Primary type and dark icon fields.
- **Muted Ink** (`#58616b`): Body copy and navigation.
- **Faint Ink** (`#626b75`): Metadata that must still meet body-text contrast in light mode.
- **Rule Gray** (`#d9dfe4`): Default one-pixel dividers and borders.
- **Overlay Ink** (`rgba(8, 12, 16, 0.78)`): Dialog backdrop; never used as a page surface.

### Named Rules

**The One Lab Blue Rule.** The global brand blue is rare. It appears in navigation actions, focus, selection, and brand signals, not as decoration on every section.

**The Product Owns Its Accent Rule.** Violet, teal, blue, and orange identify projects. They may color a preview bar, a project link, and small data markers; they do not recolor the global navigation or whole page bands.

## Typography

**Display Font:** Segoe UI Variable Display with Noto Sans SC and platform Chinese fallbacks  
**Body Font:** Segoe UI Variable Text with Noto Sans SC and platform Chinese fallbacks  
**Label/Mono Font:** Cascadia Code with SFMono and platform monospace fallbacks

**Character:** A workhorse software voice with strong ink-weight hierarchy. Monospace is reserved for versions, paths, file data, and technical metadata, never used as a decorative label style.

### Hierarchy

- **Display** (700, `clamp(2.35rem, 4.5vw, 4rem)`, 1.08): Studio statement and product names.
- **Headline** (700, `clamp(1.8rem, 2.8vw, 2.5rem)`, 1.14): Section introductions and feature groups.
- **Title** (650-700, 1rem-1.375rem, 1.35): Project titles, feature titles, and component headings.
- **Body** (400, 0.9375rem-1.125rem, 1.65-1.7): Descriptions and supporting copy, usually capped near 62ch.
- **Label** (400-600, 0.6875rem-0.8125rem, 1.4-1.65): Version numbers, platforms, filenames, and measured metadata.

### Named Rules

**The No Decorative Eyebrow Rule.** Headings carry their own hierarchy. Do not place a tracked uppercase kicker above a section heading.

**The Zero Tracking Rule.** Chinese headings and body copy keep `letter-spacing: 0`; hierarchy comes from size and weight rather than cramped negative tracking.

## Layout

The page uses a 1280px maximum content field with a fluid `clamp(20px, 4vw, 40px)` gutter. The home page becomes a two-column studio layout at 1040px: a sticky maker rail between 280px and 340px, followed by the project index. Below 1040px, the rail becomes a compact masthead and project rows stack image-first.

Each home project row pairs a large artifact preview with a metadata and purpose column on wide screens. Product pages use a two-column hero at 1000px, a three-column metric strip at 720px, and a two-column final utility area at 1000px. Section spacing uses `clamp(64px, 7vw, 96px)`.

The responsive checks ship at 390px, 768px, and 1440px. Interactive controls maintain at least 44px touch height on mobile.

## Elevation & Depth

The system is flat at rest. One-pixel borders and tonal fields establish structure; shadows are reserved for artifact depth and modal focus.

### Shadow Vocabulary

- **Preview Rest** (`0 12px 32px -24px rgba(20, 24, 29, 0.38), 0 2px 6px rgba(20, 24, 29, 0.05)`): Real screenshot shells.
- **Preview Focus** (`0 28px 64px -38px rgba(20, 24, 29, 0.46), 0 3px 10px rgba(20, 24, 29, 0.06)`): Hero artifacts and hovered screenshots.
- **Menu and Lightbox** (`0 28px 64px -38px rgba(20, 24, 29, 0.46)`): Temporary overlays only.

### Named Rules

**The Artifact Depth Rule.** A screenshot may feel like a physical working window. Page sections do not float as cards and cards are never nested.

## Shapes

Controls and content surfaces use 6px or 8px radii. Borders are crisp one-pixel rules. The only large corner treatment belongs inside a phone preview shell (24px), because that radius represents the device rather than the site's component language.

Small utility radii are fixed: 1px marker dots, 2px preview marks, 3px focus-outline corners, and 4px compact tags. The phone screen inside its shell uses 16px, nested inside the 24px device shell.

Project media frames change by type: desktop uses a compact title bar, browser uses an address field, code uses a terminal bar, phone uses an inset device frame with no site chrome, and image uses the authored image directly.

## Components

### Buttons

- **Shape:** Compact 6px radius with a 44px minimum height.
- **Primary:** Workbench Blue field with white text.
- **Hover / Focus:** Darker blue on hover; a 2px blue focus outline with 3px offset.
- **Secondary / Quiet:** White or transparent field with a one-pixel border; hover shifts to the muted ground.

### Tags

- **Style:** 4px-6px radius, one-pixel border, 24px minimum height, no uppercase transformation.
- **Status:** Published Green text on a lightly tinted green field.

### Project Previews

- **Corner Style:** 8px for desktop/browser/code; 24px for the phone device shell.
- **Background:** Product-specific soft surface, never a global theme color.
- **Border:** One-pixel strong rule.
- **Caption:** Screenshot purpose plus platform support.
- **States:** Border and shadow respond on project-link hover; focus remains visible on the wrapping link or button.

### Project Rows

- **Structure:** Artifact first, metadata second, one-pixel separators between rows.
- **Metadata:** Status, project type, year, name, purpose, summary, selected feature names, platforms, direct entry.
- **Responsive:** Side-by-side above 1040px; image-first stacking below that breakpoint.

### Feature Cards

- **Style:** White surface, 8px radius, 20px padding, one-pixel border.
- **Use:** Repeated functional capabilities only; not the structure of the whole landing page.

### Navigation

- **Desktop:** Text links with 600 weight; external GitHub link includes an authored SVG arrow.
- **Mobile:** A 44px menu control opens a 176px dropdown; theme control is 44px.
- **State:** Muted by default, full ink on hover, visible focus ring on keyboard focus.

### Screenshot Lightbox

- **Structure:** Native dialog with toolbar, scrollable media field, and caption.
- **Zoom:** The 44px "放大查看" control toggles to "适应窗口"; zoomed images become horizontally and vertically scrollable at 980px minimum width.
- **Focus:** Focus moves to the 44px close control when the dialog opens.

## Do's and Don'ts

### Do:

- **Do** lead with real interfaces and working artifacts.
- **Do** keep the global shell neutral and let project type or per-project tone own the preview.
- **Do** use 6px-8px radii, one-pixel rules, and 44px interactive targets.
- **Do** preserve WCAG AA body-text contrast in both themes.
- **Do** let future projects map to desktop, browser, phone, code, or image preview shells.

### Don't:

- **Don't** restore the warm cream paper ground, tiny tracked mono eyebrows, or decorative editorial hairlines.
- **Don't** force every project into a desktop window.
- **Don't** turn the index into equal marketing cards with icon-plus-heading-plus-copy.
- **Don't** use product accents on page-wide background bands.
- **Don't** nest cards or use colored side borders as decoration.
