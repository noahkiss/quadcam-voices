# Publishing a pack

QuadCam publishes a pack it rendered on your Mac (a `local-…` pack on the Voices page). It
prepares everything first, shows you a review, and publishes only when you click **Approve**.

## 1. Prepare

On **Gear** > **Voices**, click **Publish…** on the pack's row. Fill in the pack's id, version,
voice name, license and attribution, then click **Prepare**. From a terminal:

```bash
quadcam-cli --json gear voice publish local-callum --id en-callum --version 1 \
  --voice-name Callum --attribution "Voice: Callum (ElevenLabs)"
```

Prepare builds, in QuadCam's cache:

- the zip `voice-<id>-<version>.zip` (`pack.json` and the WAVs),
- about ten preview lines as AAC (`.m4a`), from the `sample` line set when the pack has it,
- the index entry, with the zip's and each preview's SHA-256.

Prepare refuses when:

- the speech check has not heard every line. Run **Check speech** first.
- a line the check heard wrong is not accepted. Re-render it, or listen and **Accept** it.
- the pack holds a line of your own (not one of QuadCam's line sets). Those stay private.
- the pack was made with macOS `say`, whose voices are not for publishing.
- the license is missing. ElevenLabs and Kokoro packs get theirs filled in
  ([LICENSES.md](../LICENSES.md)).

## 2. Review

The review lists every line with a play button, its text, what the speech check heard, and
its result. Accepted lines come first. QuadCam also picks a spot check: 10 to 15 lines at
random, marked **Spot check**. Listen to those at least.

## 3. Approve

**Approve** is the person's button. An agent can prepare and show the review (MCP
`voice_publish`), but no MCP call approves. The command line approves only from a terminal,
where you type the pack id:

```bash
quadcam-cli gear voice publish local-callum --approve --digest <digest from prepare>
```

On Approve, QuadCam checks that the prepared files still match the review's digest, then,
with GitHub's `gh` installed and signed in:

1. creates the release `<id>-v<version>` on this repo with the zip attached,
2. pushes a branch `pack/<id>-v<version>` with the previews and `index.json` updated,
3. opens a pull request for it.

Merging the pull request publishes the pack: GitHub Pages serves the new `index.json`, and
QuadCam's **Refresh packs** finds it. Without `gh`, Approve prints the exact commands to run
instead.
