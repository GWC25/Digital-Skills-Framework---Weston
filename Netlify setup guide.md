# Digital Skills Framework — Netlify Deployment Guide

## Overview

This guide walks you through deploying the **Digital Skills Framework** to Netlify with a GitHub Edge Function proxy. The proxy allows you to edit data securely without exposing your GitHub PAT (Personal Access Token) to the browser.

---

## Architecture Recap

```
Your Browser (index.html)
    ↓
    └─→ Passcode Modal (2402)
         ↓
         └─→ Edit Data
              ↓
              └─→ Netlify Edge Function (/.netlify/functions/sync-data)
                   ↓ (Uses PAT securely)
                   └─→ GitHub API
                        ↓
                        └─→ Updates areas-data.json
                             ↓
                             └─→ Page re-fetches live data
                                  ↓
                                  └─→ All users see updates
```

---

## Step-by-Step Setup

### 1. Create a GitHub Personal Access Token (PAT)

**Why:** This token allows the Netlify Edge Function to write to your GitHub repo on your behalf. It's kept secret on Netlify's server, never exposed to the browser.

**Steps:**

1. Go to **GitHub.com** → Settings → Developer settings → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. **Token name:** `Netlify-DSF-Proxy` (or similar)
4. **Expiration:** 90 days (for security)
5. **Select scopes:**
   - ☑️ `repo` (full control of private repositories)
   - ☑️ `workflow` (optional, if you use Actions)
6. Click **Generate token**
7. **Copy the token immediately** — you won't see it again
   - Store it somewhere safe (password manager, secure note)
   - **Do NOT** commit it to GitHub

**Token example:** `ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`

---

### 2. Push Code to Your GitHub Repo

You should already have this repo created:
- **Repo name:** `Digital-Skills-Framework---Weston`
- **Owner:** `GWC25`
- **URL:** `https://github.com/GWC25/Digital-Skills-Framework---Weston`

**Steps:**

1. **Clone the repo locally:**
   ```bash
   git clone https://github.com/GWC25/Digital-Skills-Framework---Weston.git
   cd Digital-Skills-Framework---Weston
   ```

2. **Copy these files into the repo root:**
   ```
   index.html
   areas-data.json
   netlify.toml
   netlify/edge-functions/sync-data.ts
   ```

3. **Create `.gitignore` (if not present):**
   ```
   node_modules/
   .env
   .env.local
   *.log
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add Digital Skills Framework v3 with Netlify Edge Function"
   git push origin main
   ```

---

### 3. Create a Netlify Account & Connect Your Repo

1. **Go to** [netlify.com](https://netlify.com) **→ Sign up** (use your GitHub account for easy auth)

2. **Create a new site:**
   - Dashboard → **Add new site** → **Import an existing project**
   - Select GitHub → Authorize Netlify
   - Find repo: `Digital-Skills-Framework---Weston`
   - Click **Connect**

3. **Build settings:**
   - **Base directory:** `.` (root)
   - **Build command:** `echo 'Static site'` (it's just HTML/JSON, no build needed)
   - **Publish directory:** `.` (root — publish everything)

4. **Deploy site** — Netlify will build and deploy automatically

---

### 4. Add Your GitHub PAT as an Environment Variable

This is **critical**. The Edge Function needs access to your PAT, but it must be stored on Netlify's servers, never in code.

**Steps:**

1. **In Netlify Dashboard:**
   - Go to your site → **Site settings** → **Build & deploy** → **Environment**

2. **Add new variable:**
   - **Key:** `GITHUB_PAT`
   - **Value:** Paste your GitHub PAT from Step 1
   - Click **Save**

3. **Redeploy:**
   - Go to **Deploys** → Click the latest deploy
   - Click **Trigger deploy** to rebuild with the environment variable

---

### 5. Verify Edge Function is Working

1. **Check deployment logs:**
   - Netlify Dashboard → **Deploys** → Latest deploy → **Deploy log**
   - Look for: `✓ Functions deployed`

2. **Test the endpoint:**
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/sync-data \
     -H "Content-Type: application/json" \
     -d '{
       "dataType": "digitalLeads",
       "data": [],
       "timestamp": "'$(date -u +'%Y-%m-%dT%H:%M:%SZ')'"
     }'
   ```
   - Replace `your-site.netlify.app` with your actual Netlify domain
   - If you get a JSON response (not a 404), the function is working

3. **Check GitHub:**
   - Your `areas-data.json` should update in the repo (check commit history)

---

## How to Use (Post-Deployment)

### For End Users (Read-Only Access)

1. Visit: `https://your-site.netlify.app` (or your custom domain)
2. Click **"Explore All 8 Sections"**
3. Browse tabs — Tabs 2, 3, 5, 8 show an **🔓 Unlock Editing** button (but they won't be able to edit without passcode)

### For You (With Passcode)

1. Visit the site
2. Go to **Tab 2** (All Subjects), **Tab 3** (Industry Skills), **Tab 5** (SEND), or **Tab 8** (Digital Leads)
3. Click **🔓 Unlock Editing**
4. Enter passcode: `2402`
5. Edit data:
   - Click **✎ Edit** on a row (Table 2)
   - Or edit a card directly (Tab 3, 5)
   - Update fields in the form
   - Click **Save & Sync**
6. Changes are written to `areas-data.json` in GitHub **within 2 seconds**
7. Everyone accessing the site sees the updated data live

---

## Security Notes

### Why This is Secure

- **PAT is server-side:** Stored only on Netlify's servers, never sent to the browser
- **Edge Function is a gatekeeper:** Receives requests, validates data, adds PAT, calls GitHub API
- **Passcode is client-side:** Shared with you (2402), known only to you
- **GitHub repo is public:** `areas-data.json` is readable by anyone, but writable only via Edge Function + PAT

### Best Practices

1. **Rotate the PAT periodically** (every 90 days)
   - GitHub → Settings → Personal access tokens → Regenerate token
   - Update in Netlify environment variables
   - Redeploy

2. **Monitor commits:**
   - GitHub → Commits (watch for unexpected changes)
   - Netlify logs (check function invocations)

3. **Change passcode if needed:**
   - Edit `index.html`, change `CORRECT_PASSCODE = '2402'` to a new 4-digit code
   - Redeploy to Netlify

---

## Troubleshooting

### "Error loading data. Please refresh the page."

**Cause:** `areas-data.json` not found or network issue

**Fix:**
1. Verify `areas-data.json` exists in GitHub repo root
2. Check GitHub repo name: must be exactly `Digital-Skills-Framework---Weston`
3. Check GitHub branch: must be `main`
4. Try a hard refresh (Ctrl+Shift+R)

### "Error saving changes. Check console."

**Cause:** Edge Function not responding or GitHub API error

**Fix:**
1. Open browser DevTools (F12) → Console → check error message
2. Verify Netlify deploy shows "Functions deployed"
3. Test the Edge Function endpoint manually (curl command above)
4. Check Netlify Function logs: Dashboard → Logs

### Passcode not working

**Cause:** Passcode changed or case mismatch

**Fix:**
1. Passcode is `2402` (4 digits)
2. Check `index.html` — line with `CORRECT_PASSCODE`
3. Reset browser cache (Ctrl+Shift+Delete)

### GitHub API 401 (Unauthorized)

**Cause:** Invalid or expired PAT

**Fix:**
1. Check PAT hasn't expired (GitHub → Settings → Personal access tokens)
2. Regenerate new PAT
3. Update in Netlify environment: Site settings → Environment → GITHUB_PAT
4. Redeploy

---

## What Happens When You Edit

**Timeline:**

1. **You click "Edit"** → Modal asks for passcode
2. **You enter 2402** → Validated in browser
3. **You fill form + click "Save & Sync"** → POST to `/.netlify/functions/sync-data`
4. **Edge Function receives request:**
   - Fetches current `areas-data.json` from GitHub API
   - Merges your edits into the data
   - Commits updated file back to GitHub with your PAT
5. **GitHub updates** → Commit appears in repo history
6. **Page reloads data** → `areas-data.json` re-fetched from GitHub
7. **All users see updates** → Next time they visit or refresh, they see your changes

**Speed:** Usually 1–2 seconds end-to-end

---

## Custom Domain Setup (Optional)

If you want a custom domain instead of `your-site.netlify.app`:

1. **Netlify Dashboard** → Site settings → **Domain management**
2. **Add custom domain** (e.g., `digital-skills.weston.ac.uk`)
3. **Follow Netlify's DNS setup** (add CNAME or Nameserver records with your domain registrar)
4. **Verify DNS** — Netlify will confirm once DNS propagates (can take 24 hours)

---

## Monitoring & Maintenance

### Weekly

- Check GitHub commit history: Are edits appearing?
- Test an edit: Does it sync?

### Monthly

- Review Netlify logs for errors
- Check PAT hasn't been revoked (GitHub → Settings → Tokens)

### Every 90 Days

- Regenerate PAT for security
- Update Netlify environment variable
- Redeploy

---

## Rollback (If Something Goes Wrong)

If `areas-data.json` gets corrupted or you need to revert changes:

1. **In GitHub repo:**
   - Click on `areas-data.json`
   - Click **History** (top right)
   - Click **<>** next to a previous commit
   - Click **Revert** (three dots menu) or copy-paste the old content back
   - Commit the revert

2. **Netlify will auto-redeploy** (if you have auto-deploy enabled)

3. **Users will see the reverted data** on next page load/refresh

---

## Next Steps

1. **Go live:** Share the Netlify URL with stakeholders
2. **Update digital leads:** Use Tab 8 to add names as they're identified
3. **Keep metadata fresh:** Update curriculum data in Tabs 2, 3, 5 as needed
4. **Monitor usage:** Netlify Analytics → see who's accessing the framework

---

## Questions?

Refer to:
- **Netlify Docs:** https://docs.netlify.com
- **GitHub PAT:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- **Edge Functions:** https://docs.netlify.com/edge-functions/overview/

---

**Document Version:** 1.0  
**Created:** April 28, 2026  
**Last Updated:** April 28, 2026  
**For:** Graeme Wright, Digital Pedagogy Coach, Weston Collegev
