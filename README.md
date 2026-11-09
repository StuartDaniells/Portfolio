# Stuart Daniells - Portfolio

Personal portfolio for Stuart Daniells, Software Engineer (AI & Cloud Data Engineering).
Built with React 18, TypeScript/JavaScript, Vite and Tailwind CSS.

## Routes

| Path | Page |
| --- | --- |
| `/` | Redirects to `/home` |
| `/home` / `/home/homePage` | Home (hero, links, résumé download) |
| `/home/about` | About + expertise + capability cards |
| `/home/resume` | Education, experience, awards, skills |
| `/home/works` | Works index: organizations, platform map, case-study cards |
| `/home/works/:orgSlug` | Redirects to the organization anchor on the Works index |
| `/home/works/:orgSlug/:studySlug` | Reusable case-study page template |
| `/home/recommendations` | Written recommendations with expandable text |
| `/home/blogs` | Legacy route, redirects to `/home/recommendations` |
| `/home/contact` | Contact details + Netlify Forms contact form |
| `*` | 404 |

## Scripts

- `npm start` / `npm run dev` - Vite dev server on http://localhost:3000 (shows **every** section)
- `npm run build` - production build, mode taken from `.env.production`
- `npm run build:public` - same, but fails if the flag is not `public`
- `npm run build:internal` - same, but fails if the flag is not `internal`
- `npm run verify:public` - scan `build/` for internal-only content
- `npm run preview` - preview the production build

## Contact form

The contact form on `/home/contact` is handled by **Netlify Forms**. There is no
backend, no serverless function and no third-party email SDK; the browser posts
the form to Netlify, which stores the submission and optionally emails you.

Two pieces must stay in sync:

1. `index.html` - a hidden `contact` form (`data-netlify="true"`,
   `netlify-honeypot="bot-field"`) exists only so Netlify's deploy-time HTML scan
   registers the form. Netlify never parses React-rendered markup.
2. `src/Pages/Contact/CommonContact.js` - the visible form. It posts
   `application/x-www-form-urlencoded` data to `/` with `fetch`, so there is no
   page reload. It carries the hidden `form-name=contact` and `bot-field`
   honeypot inputs.

The field names (`name`, `email`, `message`, `bot-field`) must be identical in
both files; a rename in one without the other silently drops that field from the
submission.

Builds are deployed by hand, so the form only registers after `build/` has been
rebuilt **with** the hidden form in `index.html` and uploaded. Submissions do not
work against `npm run dev` or `npm run preview` - the POST has nowhere to go, so
the page shows the error toast. Test on a deploy preview or production.

After deploying, in the Netlify UI:

1. **Forms** - confirm the `contact` form is listed.
2. Submit a test message from the live site and confirm it appears under
   **Forms > contact**.
3. **Forms > Submission notifications** - add an email notification to a my
   Mail address. The recipient must be an active member of the Netlify team.
4. Confirm the email arrives (check my email spam folder if not). Never put my email
   credentials or SMTP settings in this repo.

The site is on Netlify Legacy Free, which allows **100 form submissions per site
per month**.

## Build-time content visibility

Some case-study sections are internal-only. They are excluded at **build time**,
not hidden with CSS or a runtime toggle, so their prose, tables and Mermaid
sources never exist in the public output.

### The one file you edit

`.env.production`, at the project root:

```
PORTFOLIO_CONTENT_MODE=public
```

| Value | Result |
| --- | --- |
| `public` | Deployable build. The five internal-only sections are absent from `build/`. |
| `internal` | Private build containing the complete case studies, written to `build-internal/`. |
| missing | Fails closed to `public`. |
| anything else | The build aborts with an error. |

`npm run dev` ignores the flag and always shows all sections.

### Commands and output

| Command | Reads | Output | Safe to deploy |
| --- | --- | --- | --- |
| `npm run dev` | - (always internal) | dev server | - |
| `npm run build` | `.env.production` | `build/` or `build-internal/` | only if the flag was `public` |
| `npm run build:public` | `.env.production` (must be `public`) | `build/` | yes |
| `npm run build:internal` | `.env.production` (must be `internal`) | `build-internal/` | **never** |

`build-internal/` is git-ignored and must not be deployed. Each build clears its
own output directory first, and `npm run build` also runs `verify:public`
automatically when it produces a public build.

### How it works

1. `src/content/caseStudies/fangtooth-0N.ts` holds only publicly visible blocks.
2. `src/content/caseStudies/internal/*.internal.ts` holds internal-only blocks
   in a separate module. Nothing public may import it.
3. `registry.public.ts` imports the public bodies only; `registry.internal.ts`
   also imports the internal groups and re-inserts them at the position given by
   each group's `afterSectionId`.
4. `vite.config.js` resolves the alias `@case-study-bodies` to one of those two
   registries based on the flag. The public build therefore has no import path
   to the internal modules, so Rollup cannot emit them.
5. `src/content/caseStudies/outline.ts` derives section numbers, subsection
   letters and the table of contents from whichever sections survive, so
   removing a section renumbers everything after it automatically.

Anchor ids are text-based (`overview`, `key-architectural-decisions`), never
number-based. Older numbered anchors such as `#4-three-integration-workflows`
are kept as empty alias elements inside public headings only.

### Marking another section internal-only

1. Move its blocks (verbatim, including the `heading(...)` line) out of
   `fangtooth-0N.ts` into `internal/fangtooth-0N.internal.ts`, inside a group
   whose `afterSectionId` is the `id` of the **public section it follows**.
2. Give the heading a `legacyId` if it currently had a numeric prefix, so old
   deep links keep working in internal builds.
3. Add one distinctive string from the moved text to
   `INTERNAL_ONLY_SENTINELS` in `scripts/verify-public-build.mjs`.

No renumbering is ever needed by hand.


## Stack

React 18 · React Router 6 · Vite 5 · Tailwind CSS 3 · AOS · react-icons ·
react-modal · react-toastify · Netlify Forms · Mermaid

## Structure

```
src/
  App.tsx              route table + scroll restoration
  Hooks/AllData.tsx    experience/skills/contact content + theme state (useData)
  content/works.ts     Works metadata: organizations, studies, publication state
  content/recommendations.ts   Written recommendations shown on /home/recommendations
  content/fangtoothPlatformMap.ts   Mermaid source for the platform map
  Context/             context provider wrapping AllData
  Pages/Works/         Works index, Mermaid platform map, case-study template
  Pages/               About, Contact, Home, Experience, Recommendations, Works
  Share/               Header, Footer, PageMeta, ScrollToTop, 404, styles
  assets/images/       images, icons, résumé PDF
public/                favicon, manifest, robots.txt, SPA _redirects
```

Experience, skills and contact content lives in the arrays inside
`src/Hooks/AllData.tsx`; written recommendations live in
`src/content/recommendations.ts`.
Works metadata lives in `src/content/works.ts`; long-form case-study content is
authored as typed blocks in `src/content/caseStudies/` and rendered through the
case-study body renderer, keeping prose separate from the page layout.

## Works publication state

Each case study in `src/content/works.ts` has a `status`: `published` or
`placeholder`.

- `published` studies are linked from the Works index and render their page.
- `placeholder` studies (AlumaPower) are not linked and show the organization's
  "in preparation" note instead.

Case-study pages render the content blocks registered in
`src/content/caseStudies/`; the on-page table of contents is derived from those
blocks' headings.

## Platform map

The Works index shows one architecture diagram for Fangtooth, rendered from the
Mermaid source in `src/content/fangtoothPlatformMap.ts`. Mermaid is loaded on
demand (`import("mermaid")`), so it stays out of the initial bundle. The diagram
renders at its natural size inside a horizontally scrollable, keyboard-focusable
region - text is never scaled down to fit - and re-renders when the light/dark
theme changes. A text equivalent is exposed to assistive technology and is shown
visibly if the renderer fails to load.

Case-study cards deliberately carry no illustrations: the architecture appears
once, in this map.

## Deployment

The app is a client-side SPA, so the host must rewrite unknown paths to
`index.html`. `public/_redirects` provides this for Netlify-style hosts.
Run `npm run build` and publish the generated `build/` directory.

