# Voice + Vapi setup (do all of these)

To have Sam answer when no one picks up, you must complete **every** step below.

---

## 1. Twilio

- Buy or use a Twilio phone number (e.g. +1 844 871 6770).
- In [Twilio Console](https://console.twilio.com) → that number → **Voice**:
  - **A call comes in:** Webhook
  - **URL:** `https://YOUR-NGROK-OR-DOMAIN/api/voice/incoming`
  - **HTTP:** POST

---

## 2. Korvo → Account → Call & phone

In **Korvo** go to **Dashboard → Account**. In the **Call & phone** section fill in:

| Field | What to put |
|-------|---------------------|
| **Twilio number (inbound)** | Your Twilio number in E.164, e.g. `+18448716770`. Korvo uses this to know which org the call belongs to. |
| **Vapi Assistant ID** | From [Vapi Dashboard](https://dashboard.vapi.ai) → your Sam assistant → copy the **Assistant ID**. |
| **Vapi Phone Number ID** | In Vapi, add your **same** Twilio number (BYOC). Copy the **Phone Number ID** from that Vapi number and paste it here. |

Optional:

- **Ring human for (seconds):** e.g. 15 — how long to ring before Sam answers.
- **Forwarding number:** If you want a human to ring first; leave empty to have Sam answer immediately.

Click **Save call settings**.

**If you don’t put both Vapi Assistant ID and Vapi Phone Number ID in Korvo, Sam will not answer** — you’ll only get the short fallback message.

---

## 3. Vapi

- Create an assistant (e.g. Sam), set the system prompt, pick a female voice.
- In that assistant set **Server URL** to: `https://YOUR-NGROK-OR-DOMAIN/api/webhooks/vapi` (so Korvo gets the transcript when the call ends).
- In Vapi, add your Twilio number (BYOC) and note the **Phone Number ID** — that’s what you paste into Korvo above.

---

## 4. Korvo env (for local dev)

In `webapp/.env.local`:

- `VAPI_API_KEY` = your Vapi private API key.
- `NEXT_PUBLIC_APP_URL` = your ngrok URL (e.g. `https://xxxx.ngrok-free.dev`) so webhook URLs are correct.

Restart `npm run dev` after changing env.

---

## Quick checklist

- [ ] Twilio number’s “A call comes in” webhook = `.../api/voice/incoming`
- [ ] Korvo Account → **Twilio number (inbound)** = your Twilio number
- [ ] Korvo Account → **Vapi Assistant ID** = from Vapi dashboard
- [ ] Korvo Account → **Vapi Phone Number ID** = from Vapi (same Twilio number, BYOC)
- [ ] Vapi assistant → **Server URL** = `.../api/webhooks/vapi`
- [ ] `.env.local` has `VAPI_API_KEY` and `NEXT_PUBLIC_APP_URL` (ngrok URL when using ngrok)
