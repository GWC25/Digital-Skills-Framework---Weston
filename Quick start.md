# Quick Start — 5 Steps to Live (30 minutes)

## What You're Building

A live, editable Digital Skills Framework website where you can edit curriculum data (Tabs 2, 3, 5, 8) securely with passcode **2402**, and all changes sync to GitHub immediately.

---

## Step 1: Create Your GitHub Personal Access Token (5 min)

This is the key to secure editing. Your PAT will be kept secret on Netlify's servers.

1. Go to **GitHub** → Login
2. Click your **Profile icon** (top right) → **Settings**
3. Left sidebar → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token (classic)**
5. **Token name:** `Netlify-DSF` (or any name)
6. **Expiration:** 90 days
7. **Select scopes:** Check the box for `repo` (full access to repositories)
8. Scroll down → Click **Generate token**
9. **COPY THE TOKEN** (you won't see it again)
   - Paste it into a safe place (password manager, note app)
   - **Never** commit it to GitHub

**Token looks like:** `ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`

---

## Step 2: Clone Your Repo & Add Files (5 min)

You already have this repo: `https://github.com/GWC25/Digital-Skills-Framework---Weston`

1. **On your computer**, open Terminal/Command Prompt
2. **Navigate to where you want the folder:**
   ```bash
   cd ~/Documents
   ```

3. **Clone the repo:**
   ```bash
   git clone https://github.com/GWC25/Digital-Skills-Framework---Weston.git
   cd Digital-Skills-Framework---Weston
   ```

4. **Copy these files from the outputs into the repo:**
   - `index.html`
   - `areas-data.json`
   - `netlify.toml`
   - `netlify/edge-functions/sync-data.ts` (create the `netlify` and `edge-functions` folders first)

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add Digital Skills Framework v3"
   git push origin main
   ```

---

## Step 3: Create Netlify Account & Connect Repo (10 min)

1. Go to **[netlify.com](https://netlify.com)**
2. Click **Sign up** → Choose **GitHub** → Authorize
3. **Dashboard** → Click **Add new site** → **Import an existing project**
4. Select **GitHub** → Authorize Netlify with GitHub
5. **Find your repo:** Search for `Digital-Skills-Framework---Weston`
6. Click it → Netlify will auto-detect settings
7. **Build command:** Leave as default (or type `echo 'Static site'`)
8. **Publish directory:** `.` (the root)
9. Click **Deploy site** — Netlify will build in ~30 seconds

**You'll get a URL like:** `https://your-site-12345.netlify.app`

---

## Step 4: Add Your GitHub PAT to Netlify (5 min)

1. **In Netlify Dashboard**, go to your site
2. **Site settings** (left sidebar) → **Build & deploy** → **Environment**
3. Click **Add environment variable**
   - **Key:** `GITHUB_PAT`
   - **Value:** Paste your GitHub PAT from Step 1
   - Click **Save**
4. **Redeploy:**
   - Go to **Deploys** (left sidebar)
   - Click the latest deploy
   - Click **Trigger deploy** (button top right)
   - Wait for green checkmark

---

## Step 5: Test & Go Live (5 min)

1. **Visit your site:** Open the Netlify URL from Step 3 (e.g., `https://your-site-12345.netlify.app`)

2. **Test Tab 8 (Digital Leads):**
   - Click **Tab 8** button
   - Click **🔓 Unlock Editing** button
   - Enter passcode: `2402`
   - Click **✎ Edit** on any area (e.g., AGF - Arts, Graphics & Fashion)
   - Change the "Digital Lead" to a test name
   - Click **Save & Sync**
   - Look for green checkmark: ✓ Changes saved to GitHub

3. **Verify in GitHub:**
   - Go to `https://github.com/GWC25/Digital-Skills-Framework---Weston`
   - Click on `areas-data.json`
   - You should see a new commit at the top with your changes

4. **Refresh the website:**
   - Go back to your Netlify site
   - Press F5 to refresh
   - Go back to Tab 8 → Your change should still be there ✓

---

## You're Live! 🎉

**Share this URL with your team:**
```
https://your-site-12345.netlify.app
```

---

## What You Can Edit Now

| Tab | Edit? | How |
|-----|-------|-----|
| **Tab 2** | ✅ | All curriculum areas & digital skills |
| **Tab 3** | ✅ | Industry-specific skills |
| **Tab 5** | ✅ | SEND & accessibility provisions |
| **Tab 8** | ✅ | Digital Leads for each area ← **Start here** |

---

## Common Next Steps

### Add a Digital Lead Name
1. Visit your site → **Tab 8**
2. Click **🔓 Unlock Editing**
3. Passcode: `2402`
4. Click **✎ Edit** on an area
5. Type the Digital Lead's name
6. Click **Save & Sync**
7. Done — everyone sees it live in 1–2 seconds

### Share Read-Only Access
- Just share the URL (`https://your-site-12345.netlify.app`)
- Others can browse all 8 tabs
- They can't edit (they don't have the passcode)

### Change the Passcode
- Open `index.html` in a text editor
- Find line ~291: `const CORRECT_PASSCODE = '2402';`
- Change `'2402'` to a new 4-digit number
- Save, commit, and push to GitHub
- Netlify auto-redeploys

---

## Troubleshooting (Quick Fixes)

| Problem | Fix |
|---------|-----|
| **"Error loading data"** | Verify `areas-data.json` exists in GitHub repo root |
| **"Error saving changes"** | Check Netlify logs (Deploys → Latest → View deploy log) |
| **Passcode doesn't work** | Make sure you entered exactly `2402` (4 digits) |
| **Changes not showing** | Try a hard refresh: `Ctrl+Shift+R` |
| **GitHub API error 401** | Check your PAT hasn't expired (GitHub → Settings → Tokens) |

---

## Key Info to Save

```
🌐 Site URL:  https://your-site-12345.netlify.app
🔐 Passcode:  2402
📊 Edit Tabs: 2, 3, 5, 8
💾 Data File: areas-data.json (in GitHub)
🔑 GitHub PAT: (stored securely on Netlify, not in code)
```

---

## That's It!

You now have a live, editable, GitHub-synced framework accessible to your whole team.

**Next step:** Start adding Digital Lead names in Tab 8! 

---

**Questions?** See `NETLIFY_SETUP_GUIDE.md` for detailed troubleshooting.
