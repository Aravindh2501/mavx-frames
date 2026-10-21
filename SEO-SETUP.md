# MAVX Frames: setup and launch

## Install

This ZIP contains the full project. Back up your existing project, then merge these files. Keep your real `.env.local` and Vercel settings; `.env.example` contains public contact details and empty secret fields. Never overwrite the live database with sample data.

Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build`, then `pnpm start`.

The existing locked dependencies are preserved to avoid an unrelated framework migration.

## Required configuration

1. Set `NEXT_PUBLIC_SITE_URL` to your actual primary production origin. The existing fallback `https://www.mavxframes.com` is retained, but domain ownership and DNS are not verified. Match this value to the domain that your Vercel redirects resolve to.
2. Optional public details: `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_YOUTUBE_URL`. Empty values are hidden. Provide full profile URLs, not platform homepages.
3. Keep existing Cloudinary, Turso and enquiry settings. Test a real enquiry and confirm receipt after deploying. Live integrations were not tested with private credentials.
4. Redeploy after changing environment variables. Keep production publicly accessible; preview deployments are noindex.

## Search Console

1. Add and verify your domain property with Google's DNS record. Alternatively use a URL-prefix property and set `GOOGLE_SITE_VERIFICATION` to the supplied HTML verification token, then redeploy.
2. Open `/robots.txt` and `/sitemap.xml` on your live domain. Check that URLs use your primary domain.
3. Submit `sitemap.xml` under Search Console → Sitemaps. You do not upload robots.txt.
4. Inspect the homepage, services, Chennai, Coimbatore and a real project page. Use Test live URL and Request indexing when eligible.
5. Monitor indexing and Google's selected canonical. Sitemap success is not a ranking or indexing guarantee.
6. Optionally verify Bing Webmaster Tools with `BING_SITE_VERIFICATION` and submit the same sitemap.

## Changes

- Fresh homepage, about, portfolio, enquiry and footer copy.
- Chennai and Coimbatore as the home bases, with all-Tamil-Nadu coverage.
- Service, contact and FAQ pages with visible navigation.
- Visible service-area links instead of hidden keyword links.
- Page-specific metadata, canonicals, Open Graph and Twitter previews.
- Branded 1200 × 630 share image at `/opengraph-image`.
- Organization, WebSite, Service, BreadcrumbList, ImageGallery and FAQ structured data.
- Removed unverified coordinates, price range and platform-homepage social profiles.
- Sitemap includes real project pages and images; no invented modification timestamps.
- Corrected city Service schema, removed fixed travel-time promises and added location permission guidance.
- Isolated query-dependent owner controls to keep public content in initial HTML.
- Added accessible form labels and Vercel tracing for bundled project data.

## Portfolio and database

The original source identifies bundled local sample images as AI-generated. They remain available as labelled visual concepts, with noindex on their detail pages and exclusion from the sitemap. Real uploaded work remains indexable.

Replace all sample cover/gallery images in a project with real images to remove concept classification. `lib/projectSeo.ts` recognizes the known bundled sample filenames. Use unique filenames or Cloudinary URLs for actual photographs.

Changing `data/projects.json` does not rewrite existing Turso records. Refresh existing database titles and descriptions through owner mode. Concept labelling still works for database records using bundled sample images. Siva's bundled project copy was refreshed without changing the URL.

## AEO / GEO / AI search

Clear business facts, useful visible answers, crawlable HTML and consistent structured data support search and AI understanding. No hidden prompts, fake reviews, invented offices or keyword stuffing were added. There is no special schema or file that guarantees AI-answer inclusion. FAQ markup does not promise a Google FAQ rich result for a photography business.

Use genuine addresses and operating areas for eligible Google Business Profiles. The public phone (+91 63697 54272), email (mavxstudio@gmail.com) and Instagram (@mav_x_frames) are configured. Exact addresses and the final domain were not supplied. Organization markup is used rather than inventing a LocalBusiness address.

## Before going live

Confirm domain redirects and public contacts; test enquiry receipt; review the offered services and location ideas; replace concepts with real shoots when available; check mobile and desktop themes; verify Search Console and submit the sitemap. No deployment or Search Console account changes were performed.

## Sources

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/essentials
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

## Confirmed public contacts

- Phone: +91 63697 54272
- Email: mavxstudio@gmail.com
- Instagram: https://www.instagram.com/mav_x_frames/

These are defaults in `lib/site.ts`; existing NEXT_PUBLIC contact variables override them. Update old Vercel values and redeploy if necessary. The public email does not configure enquiry delivery: keep your Resend settings and set ENQUIRY_TO_EMAIL to the intended receiving inbox.
