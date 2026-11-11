# Beaver Field Guide

A responsive, beginner-friendly guide to North American beavers, inspired by a beaver crossing sign at OSU-Cascades in Bend, Oregon.

**Live website:** https://jamesmontemagno.github.io/beaver-field-guide/

## Explore

- Beaver biology, behavior, and adaptations.
- Five interactive stages illustrating dam construction and wetland formation, with manual navigation, play/pause, and replay.
- Ecosystem benefits, coexistence considerations, FAQs, and authoritative further reading.
- The Oregon State connection, including the 1916 yearbook and Benny Beaver's 1952 debut.

This is an independent educational project, not an official university website. The illustration is a simplified explanation, not instructions for altering streams or handling wildlife.

## Run locally

Requires Node.js 22 or later. No dependencies, install step, framework, or API keys.

```shell
npm run check
npm start
```

Open http://127.0.0.1:4173. The server serves only the generated `_site` directory and binds to the local machine. Use the `PORT` environment variable to choose a different port.

Edit `index.html`, `styles.css`, or `app.js`, rebuild with `npm run build`, then refresh. Photographs and the favicon are served locally. The entire site can also be hosted on any static host; relative asset URLs work under a GitHub Pages project subpath.

## CI and deployment

The [Pages workflow](.github/workflows/pages.yml) runs JavaScript syntax validation, builds a static artifact, and runs Node's built-in tests for resource integrity, preview serving, accessible references, and journey navigation/playback. Pull requests are checked without deployment. A successful push to `main` or manual workflow run deploys to GitHub Pages using short-lived OIDC permissions.

Repository Settings > Pages must use **GitHub Actions** as the source. Deployments use the `github-pages` environment. To add a release approval gate later, configure required reviewers for that environment. This project publishes directly to the public Pages site; it has no private staging environment.

To fork: update the canonical, Open Graph, README, repository, and robots links for the new owner/repository before publishing.

## Accessibility and privacy

Semantic landmarks, keyboard-native controls, visible focus states, an announced stage description, reduced-motion support, descriptive image text, and a no-JavaScript version of the journey. Playback is opt-in, stops at the final stage, and pauses when the page is hidden. No analytics, cookies, remote fonts, or third-party scripts.

## Sources and image credits

Original educational summaries reference:

- [ODFW: Beavers](https://myodfw.com/wildlife-viewing/species/beavers)
- [ODFW: Living with Beavers](https://myodfw.com/living-beavers)
- [The Oregon Encyclopedia: Beaver](https://www.oregonencyclopedia.org/articles/beaver/)
- [Oregon State Athletics: Traditions](https://osubeavers.com/sports/2013/7/9/208626262)
- [OSU-Cascades: About](https://osucascades.edu/about)

The two photographs are public-domain U.S. Fish and Wildlife Service works by Courtney Celley, downloaded via Wikimedia Commons and resized for the web:

- `assets/beaver.jpg`: [Beaver (28007959907)](https://commons.wikimedia.org/wiki/File:Beaver_(28007959907).jpg), eating aquatic vegetation.
- `assets/wetland.jpg`: [Beaver lodge (53692520280)](https://commons.wikimedia.org/wiki/File:Beaver_lodge_(53692520280).jpg), St. Louis County, Minnesota.

These are illustrative wildlife photos, not photos of OSU-Cascades. The dam landscape, icons, and crossing sign are original SVG illustrations.
