# Catalog typography

Automatic font matching is enabled for new catalogs. Business selection and individual templates determine the heading/body pairing; covers, product pages, contents and previews resolve the same selection. The application interface fonts are unchanged.

| Business / style | Headings | Details |
| --- | --- | --- |
| Wholesale / ordering | Roboto Condensed | Open Sans |
| Weekly and weekend promotions | Oswald | Open Sans |
| Seasonal fashion | Bodoni Moda | Lato |
| Bridal / luxury | Cormorant Garamond | Lato |
| Bold fashion / menswear | Montserrat | Open Sans |
| Beauty / minimal collections | DM Sans | Open Sans |
| Beauty editorial | Playfair Display | Lato |
| Care collection | Cormorant Garamond | Lato |
| Restaurant / home / warm lookbook | Lora | Source Sans 3 |
| Café | Poppins | Open Sans |
| Technical / specifications | IBM Plex Sans | Source Sans 3 |
| General products | Roboto | Open Sans |

These are design recommendations, not a measured industry-popularity ranking. Research did not establish a comparable ranking of fonts used in each business sector. High-contrast fashion headings and legible small-size body text informed the choices, alongside the supplied catalog references.

Primary references checked October 10, 2026:
- https://fonts.adobe.com/fonts/posh — high-contrast Didone styling for fashion and beauty.
- https://fonts.adobe.com/fonts/cuisine — food typography and Bodoni's couture association.
- https://fonts.google.com/specimen/Bodoni+Moda
- https://fonts.google.com/specimen/DM+Sans — designed for smaller text sizes.
- https://fonts.google.com/specimen/Roboto+Condensed
- https://fonts.google.com/specimen/Cormorant+Garamond
- https://fonts.google.com/specimen/Lora
- https://fonts.google.com/specimen/Oswald
- https://fonts.google.com/specimen/IBM+Plex+Sans

## Existing catalogs and manual choices

Old catalogs retain their saved numeric font selection, because it may have been intentionally customized. In the five-question survey, the design step has a “Match fonts automatically” switch. Optional settings also offers Automatic or a specific pairing. A manual selection is preserved when switching businesses or layouts. Automatic mode saves a resolved numeric font plus `fontMode: auto`; old font indices 0–4 and legacy question answer 5 (“Choose for me”) remain unchanged.

## Loading and verification

Google Fonts provides the CSS and font files over HTTPS. Export waits for regular and bold heading/body faces, and reports a loading error rather than quietly substituting another font. Wholesale headings no longer force Arial. All 15 font families and 30 normal-weight font resources were successfully downloaded during verification. Automated tests cover mapping, old saved choices, manual overrides, per-template preview resolution and wholesale output. Browser visual QA and physical scanning were not performed.

## Visual font selection

Optional settings uses selectable font cards instead of a native font dropdown. Each card renders the family name, heading example, accented words, price and digits in the actual font files. Cards stay in a loading state until the required faces load; failed previews are labeled unavailable and cannot be selected. Automatic and manual choices remain keyboard-accessible native radio controls with a selected indicator.
