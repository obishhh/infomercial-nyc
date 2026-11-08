# infomercial-nyc

The website for Infomercial, a TV rating and review app for iPhone.

Plain files and nothing to build: `index.html`, `site.css`, `posters.js`, the
posters, the icon, the App Store badge and three fonts. The page loads nothing
from anywhere else and keeps nothing about who visits it.

The icon comes twice. `icon.svg` is the app's own, with its name across the
bars, and stands in the App Store tile. `favicon.svg` is the bars alone, for a
browser tab, where the name would only blur; `favicon.ico` is the same bars for
any page that names no icon, which a browser then asks for by that name.

`support/`, `terms/` and `privacy/` are the Support, Terms and Privacy pages,
at `infomercial.nyc/support`, `/terms` and `/privacy`, which is where the app
links to them. They began as copies of the pages in
[rabbitears-site](https://github.com/obishhh/rabbitears-site), which builds up
to 1.0.0 link to and which now only send a reader on to these, so these are
the ones to change. `support/terms.html` and `support/privacy.html` are where
Terms and Privacy were on this site before, and only send a reader on too.
They differ from those first pages in two things only: a chevron in the
margin left of each title, back to the front page, and the address to write
to, which here is desk@infomercial.nyc.

© 2026 Owen Bishop. All rights reserved. The fonts in `fonts/` are not ours:
League Gothic, VT323 and Libre Caslon Text are under the SIL Open Font License,
and each licence is beside its font. Nor is `app-store.svg`: the Download on
the App Store badge is Apple's, used as Apple's marketing guidelines allow.
