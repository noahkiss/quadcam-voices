# Render a pack with Kokoro

[Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) is a small open text-to-speech model
(Apache-2.0). [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) serves it with an
OpenAI-compatible `/v1/audio/speech` endpoint, so QuadCam's `openai` provider renders with it.
A render costs nothing, and the takes stay on your Mac.

## 1. Start a Kokoro server on this Mac

Follow Kokoro-FastAPI's own instructions (Docker or a local install). It listens on port 8880
by default. Check it answers:

```bash
curl -s http://127.0.0.1:8880/v1/audio/voices | head -c 300
```

The server may run on another machine too: use its address in place of `127.0.0.1`. QuadCam
treats a server that is not on this Mac as one that may charge, so a render there asks first.

## 2. Point QuadCam at it

```bash
quadcam-cli --json settings set tts_provider=openai tts_base_url=http://127.0.0.1:8880 \
  tts_model=kokoro tts_voice=af_heart
```

Or in the app: **Settings** > **Gear** > **Voice**. `tts_voice` is one of the server's voices
(`af_heart`, `am_michael`, and others). The server needs no key; if yours does, set it with
`quadcam-cli settings set-secret tts_key`.

## 3. Render the pack

In QuadCam, open **Gear** > **Voices** and click **Render my voice**, or:

```bash
quadcam-cli --json gear voice render
```

QuadCam renders every line into a local pack (`local-<voice>`) and runs the speech check on
it (macOS 26 or later). Listen to the lines the check flags, then re-render or accept them.

## 4. Publish it

Publish the local pack as in [publishing.md](publishing.md). Give it the Kokoro license:

```bash
quadcam-cli --json gear voice publish local-af-heart --id en-kokoro-heart \
  --voice-name "Kokoro Heart" --license Apache-2.0 \
  --attribution "Kokoro-82M, voice af_heart"
```

QuadCam fills in `Apache-2.0` and a Kokoro attribution by itself when the model name
contains `kokoro`.
