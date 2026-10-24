# URL map — old WordPress → this site

Every public URL below is a real page (not a 404). Canonicals use `https://pfeiferbuild.com{path}` with a trailing slash.

## Kept 1:1 (same path as WordPress)

| Old WordPress | New page |
|---|---|
| `/` | `/` Home |
| `/about/` | `/about/` |
| `/contact/` | `/contact/` |
| `/category/services/` | `/category/services/` |
| `/decks-by-pfeifer/` | `/decks-by-pfeifer/` |
| `/kitchens/` | `/kitchens/` |
| `/bathroom-remodels/` | `/bathroom-remodels/` |
| `/detached-garages/` | `/detached-garages/` |
| `/home-addition-contractor/` | `/home-addition-contractor/` |
| `/basement-remodels/` | `/basement-remodels/` |
| `/commercial-buildings/` | `/commercial-buildings/` |
| `/full-home-remodels/` | `/full-home-remodels/` |
| `/peachtree-city-ga/` | `/peachtree-city-ga/` |
| `/tyrone-ga/` | `/tyrone-ga/` |
| `/brooks-ga/` | `/brooks-ga/` |
| `/newnan-ga/` | `/newnan-ga/` |
| `/finished-basement/` | `/finished-basement/` |
| `/second-story-addition/` | `/second-story-addition/` |
| `/maximizing-your-square-footage/` | `/maximizing-your-square-footage/` |
| `/peachtree-city-homeowners-guide/` | `/peachtree-city-homeowners-guide/` |
| `/coweta-county-homeowners-guide/` | `/coweta-county-homeowners-guide/` |
| `/tenant-buildouts/` | `/tenant-buildouts/` |
| `/popping-the-top/` | `/popping-the-top/` |
| `/building-a-garage/` | `/building-a-garage/` |
| `/screened-in-porches/` | `/screened-in-porches/` |

## New pages (no WordPress equivalent required)

| Path | Purpose |
|---|---|
| `/portfolio/` | Photo gallery by category |
| `/blog/` | Index of article slugs |
| `/get-started/` | Bid request form (maps from the old “Get Started” button) |

## 301s in `public/.htaccess`

Common WP leftovers (`/decks/`, `/wp-admin`, `/author/`, `/feed/`, `/gallery/`, city names without `-ga`, etc.) 301 to the closest live page. Add more rows there if Search Console still reports a 404 after cutover — never leave a known service or city URL dead.
