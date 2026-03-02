# Why Sam didn’t talk – checklist

When you call the number and the call ends with no assistant, check these in order.

---

## 1. Twilio webhook uses your **ngrok** URL

In [Twilio Console](https://console.twilio.com) → Phone Numbers → your number (+18448716770) → Voice configuration:

- **A call comes in:** Webhook  
- **URL:** `https://YOUR-NGROK-URL.ngrok-free.dev/api/voice/incoming`  
- Method: **POST**

If this points to localhost or is wrong, Twilio never reaches Korvo and the call can drop or do nothing.

---

## 2. Korvo knows your Twilio number

In Korvo → **Dashboard → Account → Call & phone**:

- **Twilio number (inbound):** Must be exactly the number you’re calling, e.g. `+18448716770`.

If this is wrong or empty, Korvo returns “This number is not configured” and hangs up.

---

## 3. No-answer actually runs (so Sam can answer)

- If you set a **Forwarding number**, Twilio rings that first. Until that call **times out without being answered**, the no-answer URL is not called, so Sam never runs.
- To test Sam: either **clear the Forwarding number** (so the call goes straight to no-answer → Vapi), or **don’t answer** the forwarding number and wait for the ring timeout (e.g. 15 seconds).

---

## 4. Vapi IDs in Korvo

In Korvo → **Account → Call & phone → Vapi AI**:

- **Vapi Assistant ID:** The ID of your Sam assistant from Vapi dashboard.
- **Vapi Phone Number ID:** The ID from Vapi after you **linked your Twilio number** (BYOC) in Vapi. It must be the Vapi “Phone Number” that corresponds to the same Twilio number.

If either is wrong, the no-answer route falls back to the short “Thank you for calling…” message and Sam never joins.

---

## 5. Check the terminal when you call

With Korvo running (`npm run dev`), when you call and **don’t answer** (or have no forwarding number), watch the terminal for:

- `[voice/no-answer] orgId: ... from: ...` → No-answer route was hit.
- `[voice/no-answer] Calling Vapi create-call` → Korvo is calling Vapi.
- `[voice/no-answer] Vapi create call failed:` → Vapi returned an error (check status and body).
- `[voice/no-answer] Vapi response missing twiml` → Vapi didn’t return valid TwiML.
- `[voice/no-answer] Vapi OK, returning TwiML` → Korvo got TwiML from Vapi and sent it to Twilio.

If you never see `[voice/no-answer]`, Twilio isn’t reaching your no-answer URL (check step 1 and 3). If you see “Vapi create call failed” or “missing twiml”, fix step 4 and Vapi setup.

---

## 6. Ngrok and Korvo must be running

- Korvo: `npm run dev` (and leave it running).
- Ngrok: `ngrok http 3000` (or the port Korvo uses).
- `NEXT_PUBLIC_APP_URL` in `.env.local` = your current ngrok URL (restart dev after changing).

If ngrok stops or the URL changes, update Twilio’s webhook URL and `NEXT_PUBLIC_APP_URL` to the new ngrok URL.
