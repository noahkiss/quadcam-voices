# The index format

`index.json` lists the packs. QuadCam reads it from the `voice_index` setting, which defaults
to `https://noahkiss.github.io/quadcam-voices/index.json`. It is QuadCam's voice index
(`VoiceIndex` in `src-tauri/src/gear/voice/packs.rs`), with `url`, `zip_bytes`, `date` and
`preview` added in QuadCam 0.17.

```json
{
  "schema": 1,
  "packs": [
    {
      "id": "en-example",
      "version": "1",
      "voice": "Example",
      "lang": "en",
      "provider": "elevenlabs",
      "model": "eleven_multilingual_v2",
      "settings": { "speed": 1.0, "tempo": 1.0, "trim_db": -55.0, "lead_ms": 20, "tail_ms": 150,
                    "fade_in_ms": 5, "fade_out_ms": 30, "seed": 0 },
      "lines": 300,
      "bytes": 21500000,
      "zip_bytes": 9800000,
      "sha256": "<sha256 of the zip>",
      "license": "ElevenLabs output, paid plan: commercial use allowed",
      "attribution": "Voice: Example (ElevenLabs)",
      "lines_csv_sha": "<sha256 of QuadCam's lines.csv>",
      "file": "voice-en-example-1.zip",
      "url": "https://github.com/noahkiss/quadcam-voices/releases/download/en-example-v1/voice-en-example-1.zip",
      "firmware": "edgetx",
      "date": "2026-10-11",
      "preview": [
        { "path": "SOUNDS/en/armed.wav", "text": "Armed",
          "file": "previews/en-example-1/01.m4a", "sha256": "<sha256 of the m4a>" }
      ]
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `id` | Letters, digits, `-` and `_`. The zip's `pack.json` has the same id |
| `version` | The pack's version. A new version is a new release |
| `voice`, `lang`, `provider`, `model`, `settings` | How the pack was made |
| `lines` | WAV files in the pack |
| `bytes` | The unpacked size, which is what the radio's card needs |
| `zip_bytes` | The download size |
| `sha256` | The zip's SHA-256. QuadCam refuses an entry without one, and a zip that does not match |
| `license`, `attribution` | The pack's license ([LICENSES.md](../LICENSES.md)) |
| `lines_csv_sha` | QuadCam's line list the pack was made from. QuadCam marks a pack from another list as stale |
| `file` | The zip's file name |
| `url` | The zip's address: a release asset of this repo. Without `url`, QuadCam looks for `file` next to the index |
| `firmware` | `edgetx` |
| `date` | The day the pack was published |
| `preview` | About ten lines to listen to: the card path, the text, the file (relative to the index) and its SHA-256 |

## The zip

`voice-<id>-<version>.zip` holds `pack.json` and the WAVs at their card paths under
`SOUNDS/<lang>/`. QuadCam refuses a zip with a path outside `SOUNDS/`, a `..` or a symbolic
link, and checks that every file `pack.json` lists is there.
