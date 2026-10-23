# Pufferblow brand

Everything that makes Pufferblow look and move like Pufferblow, in one repository that the client, the website, the backend's CLI and anything else can depend on.

```
assets/        the art
  avatars/       the fish: six faces (default, happy, wink, sleepy, surprised, grumpy) in twelve tones
  patterns/      banner and space-icon patterns (bubbles, crop, fish, fishfull, ring, school, tile)
  logo/          the mark: pufferblow-logo (dark and light), pufferblow-badge (+ favicon), pufferblow-mono
  loader/        "gulp and puff": animated SVG and APNG, dark, light, mono, with stills
  marks/         the logo explorations (a to h), the faces and the small plain face
cli/           the terminal glyphs
  glyphs/        half-block, braille and ASCII marks as .txt, and truecolor and 256-colour .ans
  marks.json     the same marks as rows of text, for any language
  python/        the marks as a Python module (the backend's CLI splash is generated from it)
tokens/        colour, radius, shadow, type, motion
  theme.css      the source: a Tailwind v4 theme plus the design language's own names
  tokens.css     the same as plain :root custom properties (derived)
  tokens.json    every token with its value (derived)
css/           the shared stylesheet pieces
  text.css       the text roles (.pb-title, .pb-meta, .pb-role-tag, ...): font and colour together
  motion.css     the puffer in the small moments (pop, spikes, speaking ring, bristle, typing) and reduced motion
  code.css       syntax colours for code blocks
  components.css the plain-CSS parts of components (alt text, the Edited tag, code line numbers)
src/           the code
  identity.ts    colour, fish and banner from a handle (the hash must never change: people would change colour)
  puff.ts        puff reactions; spaceIcon.ts space icons; look.ts the profile card's look and settings
  components/    PuffFace, PufferblowBrand, RoleTag, HostPill, SpaceIcon, Tooltip, TitleTooltips, Button, Card,
                 Input, Modal, Badge, ProgressBar, Spinner, EmptyState, ErrorState, LoadingState, Preload
specs/         the design sheets, as they were made (open them in a browser)
  design-language.html   the design language
  ui-mockups-v3.html     the screens: login, account picker, space, hub, friends, roster, control panel
  avatars.html, cli-glyphs.html, logo-reference.html, logo-reference-mono.html, ui-mockups-v2.html, archive/
manifest.json  what the repo ships, by name (derived)
```

## Using it

Add it as a dependency by path or by git URL:

```jsonc
// package.json of a consumer
"dependencies": { "@pufferblow/brand": "file:../brand" }
// or "github:pufferblow/brand"
```

**Styles.** In a Tailwind v4 app, import the theme and the shared CSS, and let Tailwind scan the components:

```css
@import "tailwindcss";
@import "@pufferblow/brand/theme.css";
@import "@pufferblow/brand/css";
@source "../node_modules/@pufferblow/brand/src";
```

Anywhere else, `@import "@pufferblow/brand/css"` alone gives the tokens as custom properties, the text roles and the motion.

**Code.**

```ts
import { identity, defaultAvatarUrl, bannerCss, PUFF_FACES, lookOf } from "@pufferblow/brand";
import { PuffFace, RoleTag, Tooltip, PufferblowBrand } from "@pufferblow/brand";
```

The fish and the loader are resolved with Vite's asset handling (`import.meta.glob` and `new URL(..., import.meta.url)`), so the consumer ships them with its own bundle. The components are React 19 and use Tailwind class names; they read only the tokens above.

**Art.** `@pufferblow/brand/assets/...` resolves any file; `manifest.json` lists them by name.

**Terminal marks.** `cli/marks.json` for any language. The backend generates its splash module from the repo:
`npm run cli:python -- ../pufferblow/pufferblow/cli/glyph_marks.py`.

## Working on it

```
npm install
npm run build     # derive tokens.css, tokens.json, cli/marks.json, the Python module and manifest.json
npm run check     # fail if a derived file is stale, then typecheck
npm test          # identity, puff reactions, profile look, components, and the repo's own consistency
```

Rules that are easy to break and expensive to fix:

- `identity.ts` hashes a handle to a colour, a face and a banner pattern. Every instance and client computes the same result; changing it changes everyone's colour.
- Identity colours belong to people and spaces only (avatars, server icons, banners, role tags), never to buttons, links, focus rings, panels or icons.
- Text always comes from a text role in `css/text.css`, so font and colour are never mixed by hand.
- Every animation is switched off under `prefers-reduced-motion` (`css/motion.css`).
- `tokens/theme.css` is the source of truth for tokens; edit it, then `npm run build`.

## Where it came from

The art, the sheets and the glyph exports are from the design tool's exports (the design language, the UI mockups and the terminal glyph sheet), de-duplicated into one tree. The sheets' relative links were rewritten to this layout. The tokens, text roles, motion, identity, puff reactions, profile look and components were moved here from the Pufferblow client, which should import them from here rather than keep its own copy.
