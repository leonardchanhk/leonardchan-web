# Leonard Chan Website — TODO

## Fixes & Improvements (Round 2)

- [x] Fix light/dark mode toggle (not working on live site)
- [x] W3C accessibility popup covered by chat button — put W3C, chat, back-to-top side by side
- [x] Change organisation page accent colour to blue
- [x] Make a better favicon (LC monogram)
- [x] Scroll to page top when navigating to a new page (no anchor)
- [x] Horizontal timeline with photo support (About page)
- [x] Redesign organisation cards — cool, modern, blue accent
- [x] Articles: show cover image per article
- [x] Articles: show external media logo when linking to external source (大公報, Capital, etc.)
- [x] Add TV interview links section (Insights page)
- [x] Update index.html title and SEO meta tags

## Pending (awaiting content from Leonard)

- [ ] Add full accolades list to Achievements section
- [ ] Add Project Prove details
- [ ] Add second US patent details
- [ ] Add event photos to About timeline and Impact page
- [ ] Add actual TV interview URLs (Now TV, RTHK)
- [ ] Add actual article URLs for all 大公報 and Capital articles

## Completed

- [x] Full 10-page site built and deployed on Cloudflare Pages
- [x] www.leonardchan.com DNS configured
- [x] D1 database migrated and seeded
- [x] Light/dark mode toggle (built, needs fix)
- [x] Tri-lingual EN/繁/简
- [x] W3C accessibility widget
- [x] Back to top button
- [x] AI chatbot balloon
- [x] Portrait photo (CDN hosted)
- [x] Animated particle hero
- [x] Policy formulas section
- [x] Key achievements section
- [x] Open to opportunities section

## Fixes — Round 3

- [ ] Light/dark mode toggle still not working — deep fix required
- [ ] Accent colour still orange/amber — must be fully blue throughout
- [ ] Fonts too old-fashioned — replace with modern typefaces (Inter/Plus Jakarta Sans for body, modern display font for headings)

## Fixes — Round 4

- [x] Fix accessibility popup scrollbar issue
- [x] Fix accessibility toggle switch buttons visual state
- [x] Translate ALL UI and content to all 3 languages (EN, 繁體, 简体)
- [x] Add i18n to pages without it: Interests, Media, Wisdom
- [x] Add missing i18n keys for all hardcoded content across all pages
- [x] Mark article original language and add translation indicator
- [x] Fix i18n variable display issues (insights article titles, credential chips)

## CMS Build (Cloudflare-only, de-Manus)

- [ ] Build Cloudflare D1 schema for all content elements
- [ ] Build Workers API for content CRUD and translations
- [ ] Build CMS admin frontend with content editing
- [ ] Implement auto-translate with change highlighting and approval workflow
- [ ] Wire CMS to main website (replace hardcoded i18n)
- [ ] Deploy CMS to Cloudflare Pages
