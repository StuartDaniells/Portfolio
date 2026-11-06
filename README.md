# Stuart Daniells - Portfolio

Personal portfolio for Stuart Daniells, Software Engineer (AI & Cloud Data Engineering).
Built with React 18, TypeScript/JavaScript, Vite and Tailwind CSS.

## Routes

| Path | Page |
| --- | --- |
| `/` | Redirects to `/home` |
| `/home` / `/home/homePage` | Home (hero, links, résumé download) |
| `/home/about` | About + services + client slider |
| `/home/resume` | Education, experience, awards, skills |
| `/home/works` | Works index: organizations, platform map, case-study cards |
| `/home/works/:orgSlug` | Redirects to the organization anchor on the Works index |
| `/home/works/:orgSlug/:studySlug` | Reusable case-study page template |
| `/home/blogs` | Blog grid with modal |
| `/home/contact` | Contact details + EmailJS form |
| `*` | 404 |

## Scripts

- `npm start` / `npm run dev` - Vite dev server on http://localhost:3000
- `npm run build` - production build into `build/`
- `npm run preview` - preview the production build

## Stack

React 18 · React Router 6 · Vite 5 · Tailwind CSS 3 · AOS · react-icons ·
react-slick · react-modal · rc-progress · react-toastify · EmailJS · Mermaid

## Structure

```
src/
  App.tsx              route table + scroll restoration
  Hooks/AllData.tsx    blog/experience/skills content + theme state (useData)
  content/works.ts     Works metadata: organizations, studies, publication state
  content/fangtoothPlatformMap.ts   Mermaid source for the platform map
  Context/             context provider wrapping AllData
  Pages/Works/         Works index, Mermaid platform map, case-study template
  Pages/               About, Blog, Contact, Home, Experience
  Share/               Header, Footer, PageMeta, ScrollToTop, sliders, 404, styles
  assets/images/       images, icons, résumé PDF
public/                favicon, manifest, robots.txt, SPA _redirects
```

Blog and experience content lives in the arrays inside `src/Hooks/AllData.tsx`.
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

