# DESIGN.md: RvL Portfolio, "The Exhibition"

> Redesign spec for `github.com/ravellswdd/portofolio` (React 19 + TypeScript + Vite + Tailwind v4).
> References: gravity-design.de (portrait-led hero, dark #101010 calm, playful "drag / click" physics) and pamidordesign.co (portrait intro with image trail, sticky minimal nav, selected-projects with role / timeline metadata).
> This spec keeps their *structure and pace* but uses a different font system, palette and default components.

**Design read:** a developer portfolio for recruiters and tech leads, told as a small museum exhibition. Quiet gallery surfaces, one strong 3D moment (the project gallery), fast and light scroll motion everywhere else.

**Dials:** `DESIGN_VARIANCE 7` / `MOTION_INTENSITY 7` / `VISUAL_DENSITY 3`
(Developer portfolio preset is 6/5/4. Bumped variance and motion because you asked for a scroll-motion site with a 3D gallery, lowered density because a museum needs air.)

---

## 1. Concept

The site is a museum visit, and every section is a room on the route.

| Room | Section | What it is |
|---|---|---|
| Entrance hall | Hero | Your portrait hung on a lit gallery wall, behind a velvet rope |
| Room 1 | About | Curator's statement + **The collection** (languages in glass vitrines) |
| Room 2 | Experience | Chronology rows that slide in from the right |
| Room 3 | Work | Walkable first-person gallery, or carousel |
| Visitor desk | Contact | An admission ticket with your email |

Page order: Hero → About → Experience → Work → Contact. Small room-number signs (`1`, `2`, `3`, `i`) work as museum wayfinding and tell visitors where they are on the route.

## 2. Typography (replaces Inter)

| Role | Font | Use | Why |
|---|---|---|---|
| Display | **Bricolage Grotesque** (variable, opsz 12-96, wght 400-800) | Name, section titles, painting titles | Characterful grotesk with ink-trap detail at large sizes; feels like exhibition signage, not SaaS |
| Body | **Hanken Grotesk** (400 / 500 / 600) | Paragraphs, nav, buttons | Clean, slightly warm, very readable at 16-18px |
| Placard / data | **IBM Plex Mono** (400 / 500) | Museum placards, years, tools, small labels | Museum wall-label feel; also fits "engineer" identity |

Scale (fluid, `clamp`):

```
--fs-hero:    clamp(3rem, 7.2vw, 6.5rem)   /* name only, 2 lines max */
--fs-h2:      clamp(2rem, 4.2vw, 3.5rem)
--fs-h3:      clamp(1.25rem, 2vw, 1.6rem)
--fs-body:    1.0625rem  (17px), line-height 1.6, max 65ch
--fs-small:   0.875rem
--fs-placard: 0.75rem, letter-spacing 0.06em, uppercase only for the placard header line
```

- Headings: `text-wrap: balance`, tracking `-0.03em`, weight 700 (hero 800).
- Emphasis inside a headline = italic or weight change of **the same family**. No serif mixing.
- Never justify text (the current `text-align: justify` creates rivers on mobile).
- Self-host with `@fontsource-variable/bricolage-grotesque`, `@fontsource/hanken-grotesk`, `@fontsource/ibm-plex-mono` instead of the Google `@import` in `index.css`.

---

## 3. Colour (replaces neutral-950 + purple glow)

Concept: **gallery wall + viridian.** Cool stone walls, ink text, and a single deep green accent (the colour of old museum wall paint and conservation labels). No purple, no gradient text.

| Token | Light ("Day gallery") | Dark ("Night gallery") | Use |
|---|---|---|---|
| `--wall` | `#ECEEEA` | `#0E1110` | Page background |
| `--wall-2` | `#E2E5E0` | `#151918` | Alternate band, carousel room |
| `--plinth` | `#F7F8F5` | `#1C211F` | Raised surfaces (placard, modal) |
| `--ink` | `#151817` | `#E6E9E4` | Primary text |
| `--ink-2` | `#565C59` | `#9BA39E` | Secondary text |
| `--rule` | `#C9CEC8` | `#2A302D` | Hairlines, frames' inner mat edge |
| `--accent` | `#1E6B57` (viridian) | `#6CC4A6` (lit viridian) | Links, active state, focus ring, one CTA |
| `--accent-ink` | `#F7F8F5` | `#0E1110` | Text on accent |
| `--frame` | `#2B2622` | `#3A322B` | Painting frames (dark walnut) |
| `--spot` | `rgba(255,248,230,.55)` | `rgba(255,240,210,.18)` | Spotlight cones in the gallery |

Contrast checks (WCAG): ink on wall 15.9:1 light / 14.6:1 dark; ink-2 on wall 6.1:1 / 6.9:1; accent on wall 5.9:1 / 9.1:1. All pass AA, body passes AAA.

Theme behaviour:
- Default = system (`prefers-color-scheme`). Manual toggle in nav, saved to `localStorage`.
- Toggle uses the **View Transitions API** with a circular reveal from the button (falls back to an instant swap).
- Set `data-theme` on `<html>` **before React mounts** (tiny inline script in `index.html`) to avoid a flash of the wrong theme.
- Tailwind v4: define tokens with `@theme` and switch values under `[data-theme="dark"]`; use classes like `bg-wall text-ink`.

---

## 4. Shape, depth, grain

- Radius system: **sharp** for frames, images and placards (0px, like a gallery). **Pill** for interactive controls (buttons, theme toggle, carousel arrows). Nothing else rounded. This replaces the current 15-25px rounded everything.
- Shadows only in the gallery (paintings on the wall), tinted to the wall hue, never pure black.
- Optional film grain: one `position: fixed; pointer-events: none` pseudo-element at 4% opacity. Never on scrolling containers.

---

## 5. Motion system ("fast scroll")

Goal: the site feels quick and responsive. Nothing makes the visitor wait.

**Stack**
- `lenis` for smooth scrolling, tuned **fast**: `duration: 0.9`, `easing: t => 1 - Math.pow(1 - t, 4)`, `wheelMultiplier: 1.1`, `touchMultiplier: 1.4`. Disable on touch devices (`syncTouch: false`) so mobile keeps native momentum.
- `gsap` + `ScrollTrigger` for the two scrubbed moments (hero exit, statement highlight). Connect Lenis to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
- `motion` (`motion/react`, the renamed framer-motion you already use) for enter reveals, the modal and hover physics. Keep GSAP and Motion in **separate components**.

**Timing tokens**
```
--dur-fast: 180ms    hover, press
--dur-base: 380ms    reveals
--dur-slow: 620ms    modal, theme transition
--ease-out: cubic-bezier(.16, 1, .3, 1)   (expo out, snappy start)
stagger: 40-60ms, never above 80ms
reveal distance: 16-24px (not 100px like now)
```

**Where motion lives (and why)**

| Moment | Motion | Reason |
|---|---|---|
| Hero load | Spotlight flickers on, frame "hangs" into place, name rises line by line (mask reveal) | Sets the scene and hierarchy in under 1.2s |
| Hero pointer | Layered scene tilts up to ±4.5° toward the cursor (depth parallax) | iPhone-style perspective, makes the wall feel real |
| Hero exit on scroll | Scene recedes (`translateZ(-220px) rotateX(7deg)`) and fades, scrubbed | Stepping back from the entrance into the museum |
| Statement | Words fill from `--ink-2` to `--ink` as you scroll | Makes reading the About text part of the scroll |
| Collection | Hover/focus turns the logo once in 3D and slides a glass reflection | Feedback, and the feeling of a physical object |
| Experience | Rows slide in from right to left, scrubbed, in three layers | The chronology "arrives" in order |
| Gallery | First-person walk, guided glide between paintings | The one theatrical moment |
| Buttons | `scale(.97)` on press, accent fill on hover | Tactile feedback |

**Remove from the current build:** infinite floating tech icons, 1s+ linear reveals, x: ±100px slide-ins, `whileHover scale 1.1` on buttons.

**Reduced motion:** with `prefers-reduced-motion: reduce`, Lenis is off, scrubs are off, reveals are instant, and the carousel becomes a flat, swipeable row.

---

## 6. Sections

### 6.1 Nav
- Sticky, 64px. `RvL` wordmark, `About`, `Experience`, `Work`, `Contact`, and a "Day / Night" pill (gallery lighting). Active room gets the viridian underline. Skip link first.

### 6.2 Entrance hall (hero)
A real exhibition entrance, built in layers so it can move in 3D:
- **Wall:** plaster texture (generated noise, multiplied over `--hall-wall`), soft vignette, floor band with a dark baseboard.
- **Portrait:** framed (walnut + off-white mat) and hung on the right, with a ceiling track light above it and a warm light pool on the wall that "switches on" (short flicker) when the page loads.
- **Wall label** next to the frame in IBM Plex Mono: name, "Portrait in a tea plantation, Photograph", and what is on view (Appfuxion, BINUS).
- **Wall lettering** on the left: "Now showing", your name, one subtitle line, `View work` + `Download CV`.
- **Velvet rope** on two posts in the foreground.
- **iPhone-style depth:** wall at `translateZ(-30px)`, text `14px`, portrait `36px`, rope `170px`. The whole scene tilts up to ±4.5° toward the pointer, so the rope moves most and the wall least. On scroll the scene recedes and tips back (Photos-app zoom-out).
- Mobile: stacked (text, then framed portrait, then label), no tilt, no rope.

### 6.3 Room 1: statement + the collection (new skills concept)
- Statement: one large paragraph that fills word by word as you scroll, with a small framed photo.
- **The collection:** each language or tool sits in its own glass vitrine on a plinth, lit from above, with a museum label: accession number (`RvL.01 / PY`), name, type, and **"Used in"** (the real projects). No skill bars or percentages.
- Python is the centrepiece (2 × 2 case). Hovering or focusing a case turns the logo once in 3D, lifts it, and slides a reflection across the glass.
- Logos are official Simple Icons paths (Python, TypeScript, React, JavaScript, PostgreSQL, HTML5 + CSS3, MySQL, OpenJDK, C) in their brand colours.

### 6.4 Room 2: experience (Pamidor "Skillset" rows)
- Huge "Experience" title that drifts left as you scroll through the section.
- Rows: number | role in large type | org, one-line description, dates. 8 rows: Appfuxion first, then projects, then two organisation roles.
- **Motion:** every row is scrubbed by scroll and enters **from right to left** (46vw → 0, opacity 0.05 → 1). The title travels a further 16vw and the side text 8vw, so each row lands in three layers. The hairline above each row draws from the right at the same time.
- Implementation: one `requestAnimationFrame` loop that runs only while the section is on screen (IntersectionObserver), writing a `--p` value per row. In React use `useScroll({ target, offset: ["start end", "start center"] })` + `useTransform`. This works in every browser; v2 used CSS scroll timelines and broke inside an `overflow: hidden` section.
- The cursor-following image popup is removed.

### 6.5 Room 3: the gallery
Segmented switch: **Walk the gallery** (default) / **Carousel**.
- Room 14 × 26 m, 5.4 m ceiling with beams, skylight panels and track rails; oak plank floor, plaster walls, skirting, a doorway on the entrance wall, two leather benches with steel legs, stanchions with a green velvet rope in front of the centrepiece.
- Paintings: walnut frames with a gilded inner lip, mat, project image, a 3D wall placard each, and one track spotlight per painting that **casts real shadows** (frames on the wall, benches and posts on the floor).
- Controls: drag to look, `WASD`/arrows to walk (only when the room has focus), click the floor to walk, click a painting to walk up to it, click again or Enter to open it. Guided ← → route, full-screen button. Mobile: swipe to look, tap to walk.
- Day/Night changes wall, floor and ceiling colours and light levels.
- Performance: renders only when on screen and moving, shadow maps 1024 px (512 on touch devices), pixel ratio ≤ 1.75. Lazy-load three.js when the section is near.
- Fallback: no WebGL → carousel only.

### 6.6 Visitor desk (contact)
- Headline "Hiring for an internship or a junior role? Get in touch."
- **Admission ticket:** "Admit one", your email large, `Copy email`, LinkedIn / GitHub / Instagram, and a perforated stub with `RvL` and a barcode pattern. On mobile the stub moves under the ticket.
- The old tech marquee is removed; the collection replaces it.

## 7. Component & code changes (from the audit)

| Current | Change to |
|---|---|
| Inter via Google `@import` | Self-hosted Bricolage / Hanken / Plex Mono |
| Purple radial glow on `#0a0a0a` | Token palette above, light + dark |
| Gradient text on subtitle | Solid `--ink-2` |
| `padding-top: 15rem` hero | `min-h-[100dvh]`, max 6rem top padding |
| `<p onClick>` nav | `<a href="#id">` + `scroll-margin-top: 80px` |
| `useState<any>` for project | Typed `Project` interface |
| Modal without Esc / focus trap | Accessible dialog (Radix Dialog or native `<dialog>`) |
| Infinite floating icons | Logos inside the collection vitrines (no marquee) |
| Emoji in "Where to Find Me!" heading | Plain heading |
| `swiper` dependency (unused now) | Remove |
| Per-component `.css` files + Tailwind | Pick Tailwind v4 tokens as the one system |
| 2-7 MB JPGs in `/public` | AVIF/WebP at 3 sizes, `srcset`, explicit width/height |
| Title Case headings ("Where to Find Me!") | Sentence case, no exclamation marks |
| `vite.svg` favicon, "learn-react-app" package name | RvL favicon set + proper name |
| Divs everywhere | `<header> <main> <section> <footer>`, one `<h1>` |
| No 404 | A small "Room closed" 404 with a link back to the gallery (if you add routes) |

Packages: `npm i lenis gsap motion three @react-three/fiber @react-three/drei @phosphor-icons/react @fontsource-variable/bricolage-grotesque @fontsource/hanken-grotesk @fontsource/ibm-plex-mono` then `npm rm framer-motion swiper react-icons` once migrated.

Suggested structure:
```
src/
  data/projects.ts, experience.ts       typed content
  theme/ThemeProvider.tsx, tokens.css
  motion/LenisProvider.tsx, reveal.tsx
  sections/EntranceHall, Statement, Collection, Experience, Gallery, VisitorDesk
  collection/Vitrine.tsx
  gallery/MuseumScene.tsx (R3F, lazy), Painting3D.tsx, ArcCarousel.tsx, ExhibitDialog.tsx
```

---

## 8. Things to watch out for

1. **Image weight (biggest issue today).** `intro.JPG` is 6.7 MB and `aboutt.jpg` 4.7 MB. On mobile data the hero can take 5-10 s. Convert to AVIF/WebP (hero ≤ 250 KB), preload only the hero, lazy-load the rest. Target LCP < 2.5 s.
2. **3D on low-end phones.** Many transformed layers + shadows + blur drop frames. Limit to 5-7 paintings, avoid `backdrop-filter` inside the gallery, use the flat coverflow on small screens.
3. **Scroll hijacking.** Smooth scroll that is too slow or "floaty" frustrates people and breaks trackpads. Keep Lenis fast, never lock scroll for the carousel, and never pin a section for more than ~1 viewport.
4. **Accessibility.** Keyboard control for the carousel, visible focus ring (accent, 2px offset), `aria-roledescription="carousel"`, live region announcing "Project 2 of 5: TukangIN", alt text for every painting, reduced-motion fallback.
5. **Recruiter speed.** Most visitors give you 30-60 seconds. Name, role and "View work" must be readable in the first second; the CV must be one click away; project placards must say your role, not only the project name.
6. **Privacy.** Your phone number is public on the current site. Consider removing it (email + LinkedIn are enough) and use a contact form or copy-button email to reduce scraping. Do not show the Appfuxion internal ERP UI unless your company allows it; describe it in words instead.
7. **SEO and sharing.** A Vite SPA ships an almost empty HTML file. Add `<title>`, meta description, Open Graph image (your portrait + name), and consider prerendering (e.g. `vite-plugin-prerender` or moving to Next.js / Astro later).
8. **Theme flash.** Set the theme attribute in an inline script in `index.html` before the bundle loads.
9. **Broken / stale links.** The portfolio project points to `react-portofolio` while the repo is `portofolio`. Check every Git, Colab, Drive and YouTube link; Drive CV links can expire or require permission.
10. **Fonts and licensing.** All three fonts are OFL (free). Self-hosting avoids the Google Fonts privacy issue some EU visitors care about and speeds up first paint.
11. **Bundle size.** GSAP + Lenis + Motion is about 60-70 KB gzipped together. That is fine; adding Three.js is a bigger decision. Run Lighthouse after each section lands.
12. **Content freshness.** Experience still ends at June 2025. Add the internship and keep `data/*.ts` as the single source of truth so updates are one file.

---

## 9. Build order (one section at a time)

1. Foundation: tokens, fonts, theme toggle, Lenis, typed data files, image optimisation
2. Nav + entrance hall (hero)
3. Room 1: statement + the collection
4. Room 2: experience rows
5. Room 3: carousel + exhibit dialog, then the R3F walkable gallery
6. Visitor desk (ticket) + footer
7. SEO, accessibility and Lighthouse pass
