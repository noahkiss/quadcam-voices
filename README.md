# QuadCam Voices

Voice packs for EdgeTX radios, made with [QuadCam](https://github.com/noahkiss/quadcam).

- **Listen first:** <https://noahkiss.github.io/quadcam-voices/> lists every pack, with a few
  lines you can play in the browser.
- **Install:** in QuadCam, open **Gear** > **Voices** > **Get voice packs**, click **Refresh
  packs**, then **Install**. QuadCam reads this repo's index by default (the `voice_index`
  setting).

## What is here

| Path | Holds |
|---|---|
| `index.json` | The pack index QuadCam reads. Format: [docs/index-format.md](docs/index-format.md) |
| `previews/` | Each pack's preview lines (AAC in `.m4a`), which the site and QuadCam play |
| `index.html`, `site.css`, `site.js` | The site, served by GitHub Pages from `main`. No build step |
| `docs/` | The index format, how a pack is published, and how to render a pack with Kokoro |
| `LICENSES.md` | The license of each kind of pack |

The packs are not in the repo. Each pack is a zip attached to a GitHub release of this repo,
one release per pack version (tag `<id>-v<version>`). The index gives the zip's address and
its SHA-256; QuadCam refuses a download whose hash differs.

## Publishing a pack

QuadCam publishes a pack from its Voices page or its command line. It refuses a pack until
the speech check heard every line right, or you accepted each line it flagged. You then
listen through a review page, and nothing goes out until you click **Approve and publish**. See
[docs/publishing.md](docs/publishing.md).

## Licenses

The code and the site are MIT ([LICENSE](LICENSE)). Each pack carries its own license in
the index and in its `pack.json`; [LICENSES.md](LICENSES.md) lists them.
