# MAVX Frames portfolio

Next.js 15 + GSAP + Tailwind, with Cloudinary uploads.

## Run

    pnpm install
    cp .env.example .env.local
    pnpm dev

Fill `.env.local` with your Cloudinary cloud name, API key and secret. Set `ADMIN_KEY` to protect editing.

## Pages

- `/` home: animated hero, horizontal "In Focus" scroll with mixed shapes, about, footer
- `/work` auto-changing full-width hero, tabs by type (All, each category, Reels), filtered gallery
- `/work/[slug]` project page: photographs, reels, next story

## Owner mode

Add `?edit=true` to any URL. A plus button appears in the navbar and a pencil appears on every project. If `ADMIN_KEY` is set, you are asked for it once per browser session.

## Images and video

Photos are resized to a 2400px long edge and converted to WebP (quality 92) in the browser, then uploaded straight to Cloudinary with a signed request that also enforces WebP and a 2400px cap on their side. Delivery uses `f_auto,q_auto:best` at the width needed. Reels are capped at 1080x1920 MP4.

## Data

The default projects live in `lib/defaultProjects.ts`. On first run they are copied to `data/projects.json`, which is what edits write to. Delete that file to reset to the defaults. Hosts with a read-only filesystem (Vercel) need a database in `lib/store.ts` instead.
