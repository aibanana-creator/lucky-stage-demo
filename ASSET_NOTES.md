# Bundled visual assets

All hero assets are bundled locally for Vercel deployment. They are project-specific AI-generated visual assets created during the Lucky Stage build.

| File | Stage | Format / Dimensions | SHA-256 |
| --- | --- | --- | --- |
| `public/images/slot-hero-3a6927d6.webp` | TYPE 01 SLOT | WebP / 1920×1080 | `3a6927d6d1cdbdf0890bac4597c9587ea6ac5893672ab333f20600689fddcae6` |
| `public/images/roulette-hero-cf0a2308.webp` | TYPE 02 ROULETTE | WebP / 1920×1080 | `cf0a2308c06b40360dfde9164ee015795330bf043920ad31a423609d03c8f682` |
| `public/images/garagara-hero-29297e9.webp` | TYPE 03 GARAGARA | WebP / 1920×1080 | `29297e9e64aace15af58d45792f0b15f783b7c27736bf11c2b82a803299c676b` |
| `public/lucky-stage-mark.svg` | Brand mark | SVG | repository-managed |

The three WebP filenames include a short content hash. `vercel.json` applies immutable cache headers to `/images/*`; when replacing an image, use a new filename and update `src/content/stageContent.ts`.
