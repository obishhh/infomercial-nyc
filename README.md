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

`release-notes/` is what has changed in the app, build by build, at
`infomercial.nyc/release-notes`, linked from the foot of the front page. It is
set like Support, Terms and Privacy, with a block of colour naming each kind
of change. Every build is on it, newest first, with the day it went out.
The next one goes over the newest before it ships, under its number alone, and
its notes are the App Store's What's New. Only what has been merged goes on it,
a line each in plain words: nothing still being worked on, and nothing about
how it was built. Support, Terms and Privacy link to it in their small print.

`feature-request/` is a form for asking for something, at
`infomercial.nyc/feature-request`, set like the pages above. It is the one
page here that sends anything anywhere: what is typed into it goes, by
`request.js`, to a Supabase project of the website's own, which is not the
app's. The key in `request.js` is that project's publishable one, meant to be
public: all it can do is call the one function that takes a request, and the
table behind it grants nothing, so nobody can read what was sent. Requests
are read on that project's dashboard. The table and the function, and a
check of what they promise, are in the app's repository under `Tools/site`.

© 2026 Owen Bishop. All rights reserved. The fonts in `fonts/` are not ours:
League Gothic, VT323 and Libre Caslon Text are under the SIL Open Font License,
and each licence is beside its font. Nor is `app-store.svg`: the Download on
the App Store badge is Apple's, used as Apple's marketing guidelines allow.
