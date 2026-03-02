# Running Korvo locally with ngrok (for Vapi webhook)

## Order matters

1. **Start Korvo first** (so port 3000 is serving).
2. **Then start ngrok** (so the tunnel points to 3000).

If you start ngrok before Korvo, or Korvo crashes, the ngrok link will show "connection failed" because nothing is listening on 3000.

---

## Steps

### 1. Start Korvo

```bash
cd webapp
npm run dev
```

Wait until you see something like:

- `✓ Ready in ...`
- `Local: http://localhost:3000`

Leave this terminal open.

### 2. Start ngrok (in a second terminal)

```bash
ngrok http 3000
```

Copy the **HTTPS** URL, e.g. `https://abc123.ngrok-free.app`.

### 3. Test the link

- **In a browser:** Open `https://your-ngrok-url.ngrok-free.app`
  - **Ngrok free tier:** You may see a page saying "You are about to visit...". Click **"Visit Site"** to continue. Then you should see the Korvo app (login page or dashboard).
  - If you get "connection failed" or "refused", Korvo is not running on 3000. Go back to step 1 and restart `npm run dev`.

- **Webhook URL** (`https://your-ngrok-url.ngrok-free.app/api/webhooks/vapi`):  
  Opening this in a browser often shows an error or "Bad request". That is normal. This URL is for Vapi to POST to when a call ends; it is not meant to be opened in a browser.

### 4. Use in Vapi

In Vapi → Assistant → Server URL, set:

```
https://your-ngrok-url.ngrok-free.app/api/webhooks/vapi
```

(Use the exact URL from step 2.)

---

## If port 3000 "stops working"

- Stop the Korvo dev server (Ctrl+C in the terminal where `npm run dev` is running).
- Optionally clear the lock and restart:

  ```bash
  cd webapp
  rm -rf .next/dev
  npm run dev
  ```

- Then start ngrok again in the other terminal: `ngrok http 3000`.
