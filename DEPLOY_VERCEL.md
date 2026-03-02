# Deploy Korvo to Vercel (no ngrok)

Do these steps in order. Your code is ready; you just need to put it on GitHub and connect Vercel.

---

## Step 1: Create a new repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** `Korvo` (or `korvo-webapp`).
3. **Public.** Don’t add a README, .gitignore, or license (we already have them).
4. Click **Create repository**.

---

## Step 2: Push your code from the Korvo folder

In a terminal, run these from the **Korvo** folder (the one that contains `webapp` and this file). Replace `jefffleurima` with your GitHub username if different.

```bash
cd /Users/jefffleurima/Desktop/Korvo

git init
git add .
git commit -m "Initial commit: Korvo med spa app"
git branch -M main
git remote add origin https://github.com/jefffleurima/Korvo.git
git push -u origin main
```

If GitHub asks for login, use a [Personal Access Token](https://github.com/settings/tokens) as the password.

---

## Step 3: Import the project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use “Continue with GitHub”).
2. **Add New…** → **Project**.
3. **Import** the repo you just pushed (e.g. `jefffleurima/Korvo`).
4. **Root Directory:** click **Edit** and set it to **`webapp`** (so Vercel builds the Next app).
5. **Framework Preset:** Next.js (should be detected).
6. Before deploying, open **Environment Variables** and add every variable from your `webapp/.env.local`:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VAPI_API_KEY`
   - `TWILIO_ACCOUNT_SID` (if you use Twilio)
   - `TWILIO_AUTH_TOKEN` (if you use Twilio)
   - `NEXT_PUBLIC_APP_URL` — leave this **empty** for now; we’ll set it after the first deploy.
   - Optionally: `OPENAI_API_KEY`, `ELEVENLABS_API_KEY` if you use them.

7. Click **Deploy**. Wait for the build to finish.

---

## Step 4: Set the live URL and redeploy

1. After the first deploy, Vercel shows your app URL, e.g. `https://korvo-xxxx.vercel.app`.
2. In the Vercel project go to **Settings** → **Environment Variables**.
3. Add or edit:
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** `https://korvo-xxxx.vercel.app` (your real Vercel URL).
4. Go to **Deployments** → open the **⋯** on the latest deployment → **Redeploy** (so the new env is used).

---

## Step 5: Point Twilio and Vapi at the live URL

Use your Vercel URL everywhere (no ngrok):

- **Twilio** → your number → Voice → “A call comes in”:  
  `https://korvo-xxxx.vercel.app/api/voice/incoming`
- **Vapi** → your assistant → Server URL:  
  `https://korvo-xxxx.vercel.app/api/webhooks/vapi`
- In **Korvo** (Account → Call & phone), your Twilio number and Vapi IDs stay the same; the app will use `NEXT_PUBLIC_APP_URL` from Vercel.

---

## Updating the app after deploy

```bash
cd /Users/jefffleurima/Desktop/Korvo
git add .
git commit -m "Describe your change"
git push
```

Vercel will build and deploy automatically. The live site updates in a few minutes.
