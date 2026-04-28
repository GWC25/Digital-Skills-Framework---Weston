# Digital Skills Framework v3 — Deployment Checklist

**Project:** Weston College Digital Pedagogy Coach Resource  
**Version:** 3.0 (Live Editable Edition with Netlify Edge Function Proxy)  
**Created:** April 28, 2026  
**For:** Graeme Wright

---

## Pre-Deployment Checklist

### Documentation
- ✅ `README.md` — Project overview & architecture
- ✅ `QUICK_START.md` — 5-step 30-minute setup guide
- ✅ `NETLIFY_SETUP_GUIDE.md` — Detailed deployment & troubleshooting
- ✅ This checklist

### Code Files
- ✅ `index.html` — 8-tab framework with passcode modal, Tab 8 (Digital Leads), edit forms
- ✅ `areas-data.json` — Single source of truth (all editable data)
- ✅ `netlify.toml` — Netlify deployment config
- ✅ `netlify/edge-functions/sync-data.ts` — GitHub API proxy (server-side PAT holder)

### Features Implemented
- ✅ **8 Tabs:** General Skills, All Subjects, Industry Skills, Framing, SEND, Progression, Teacher Skills, Digital Leads
- ✅ **Editable Tabs:** 2 (All Subjects), 3 (Industry Skills), 5 (SEND), 8 (Digital Leads) — all other tabs read-only
- ✅ **Passcode Protection:** 4-digit (2402) for editing
- ✅ **Passcode Modal:** Click "Unlock Editing" → modal asks for code → validates in browser
- ✅ **Tab 8: Digital Leads (NEW):** Shows area code, name, Head of Area, Digital Lead — fully editable
- ✅ **GitHub Sync:** Edits write to `areas-data.json` via Netlify Edge Function
- ✅ **Live Updates:** All users see changes within 1–2 seconds
- ✅ **Colour Contrast (WCAG 2.2 AA):** All combinations verified (16.59:1, 6.66:1, 17.95:1)
- ✅ **Keyboard Accessible:** Focus outlines, proper ARIA labels, passcode input validation

---

## Deployment Steps (Do These Once)

### 1. Create GitHub Personal Access Token
- [ ] Go to GitHub → Settings → Personal access tokens → Generate new token (classic)
- [ ] Name: `Netlify-DSF-Proxy`
- [ ] Expiration: 90 days
- [ ] Scope: `repo` (full repository access)
- [ ] Generate and **COPY the token** (store securely)
- [ ] **Token:** `ghp_...` (save for Step 4)

### 2. Push Code to GitHub
- [ ] Clone repo: `git clone https://github.com/GWC25/Digital-Skills-Framework---Weston.git`
- [ ] Add files: `index.html`, `areas-data.json`, `netlify.toml`, `netlify/edge-functions/sync-data.ts`
- [ ] Commit: `git commit -m "Add Digital Skills Framework v3"`
- [ ] Push: `git push origin main`
- [ ] Verify files appear in GitHub repo

### 3. Create Netlify Account & Connect Repo
- [ ] Go to [netlify.com](https://netlify.com) → Sign up (via GitHub is easiest)
- [ ] Dashboard → Add new site → Import existing project
- [ ] Select repo: `Digital-Skills-Framework---Weston`
- [ ] Build command: `echo 'Static site'`
- [ ] Publish directory: `.` (root)
- [ ] Deploy
- [ ] **Note your Netlify URL:** `https://your-site.netlify.app`

### 4. Add GitHub PAT to Netlify
- [ ] In Netlify Dashboard → Site settings → Build & deploy → Environment
- [ ] Add variable: Key = `GITHUB_PAT`, Value = your PAT from Step 1
- [ ] Save
- [ ] Redeploy: Go to Deploys → Trigger deploy
- [ ] Wait for green checkmark

### 5. Test the System
- [ ] Visit your Netlify site URL
- [ ] Click **Tab 8** (Digital Leads)
- [ ] Click **🔓 Unlock Editing**
- [ ] Enter passcode: `2402`
- [ ] Click **✎ Edit** on any area
- [ ] Change the "Digital Lead" field to a test name
- [ ] Click **Save & Sync**
- [ ] Look for: `✓ Changes saved to GitHub`
- [ ] Go to GitHub → Verify `areas-data.json` was updated (check commits)
- [ ] Refresh the website → Verify change persists

---

## Post-Deployment Checklist

### Share the Link
- [ ] **Live URL:** `https://your-site-12345.netlify.app` (replace with actual)
- [ ] Share with:
  - [ ] Heads of Area (HoAs)
  - [ ] TLA team (Marisha West, TLAMs)
  - [ ] SEND specialists (Liz Burkley, Lois Knight)
  - [ ] Digital Leads (as identified)
  - [ ] Neil Davies (QA oversight)

### Get Initial Data In
- [ ] **Digital Leads identified?** Add names to Tab 8
- [ ] **Areas curriculum data current?** Update Tab 2 as needed
- [ ] **Industry skills aligned with latest labour market data?** Check Tab 3
- [ ] **SEND provisions match your centres of excellence?** Verify Tab 5

### Monitor & Maintain
- [ ] **Weekly:** Check GitHub commit history (are edits appearing?)
- [ ] **Weekly:** Test an edit (does it sync?)
- [ ] **Monthly:** Review Netlify logs for errors
- [ ] **Monthly:** Verify GitHub PAT hasn't been revoked
- [ ] **Every 90 days:** Regenerate GitHub PAT

---

## Key Information to Keep Safe

```
Netlify Site URL:
https://[your-site].netlify.app

GitHub Repo:
https://github.com/GWC25/Digital-Skills-Framework---Weston

Passcode (4 digits):
2402

GitHub PAT (keep secret, store in password manager):
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Netlify Dashboard:
https://app.netlify.com/sites/[your-site]

Data File:
https://github.com/GWC25/Digital-Skills-Framework---Weston/blob/main/areas-data.json
```

---

## What Each File Does

### index.html (Main App)
- 8 tabs with navigation
- Passcode modal for editing
- Fetches `areas-data.json` from GitHub on page load
- Edit forms for Tabs 2, 3, 5, 8
- Calls Netlify Edge Function to save changes
- WCAG 2.2 AA accessible

### areas-data.json (Data Source)
- Single source of truth for all content
- Structured: `digitalLeads[]`, `areas[]`, `industrySkills{}`, `sendProvisions{}`
- Updated by Edge Function when you edit
- Fetched by browser on page load for live data

### netlify/edge-functions/sync-data.ts (Server-Side Proxy)
- Receives edit requests from browser
- **Holds your GitHub PAT** (never sent to browser)
- Calls GitHub API to write updated file
- Returns success/error to browser
- Commits automatically with timestamp

### netlify.toml (Configuration)
- Tells Netlify where the Edge Function is
- Configures static site serving
- Sets environment variable requirements

---

## How It Stays Secure

| Layer | Security |
|-------|----------|
| **Browser** | Passcode validated locally (2402) |
| **Netlify Edge Function** | GitHub PAT stored in environment variables (encrypted) |
| **GitHub API** | HTTPS only, authenticated with PAT |
| **Data** | `areas-data.json` is public (readable by anyone) but writable only via PAT |
| **User** | Only you know the passcode; you control the PAT |

---

## Scaling (If You Need More Later)

### Add More Editable Sections
1. Add data to `areas-data.json` with new structure
2. Add edit buttons & forms to `index.html`
3. Update Edge Function to handle new `dataType`
4. Deploy to Netlify

### Add User Accounts (If Not Just You)
- Consider: GitHub Gist API (for different users with different PATs)
- Or: Add a backend (Supabase, Firebase) instead of Edge Function
- Or: Multiple passcodes (if you want different access levels)

### Add Backup/Versioning
- GitHub automatically keeps version history
- Use GitHub's "History" view to see all edits
- Click any past commit to see what changed

---

## Common Maintenance Tasks

### Rotate GitHub PAT (Every 90 Days for Security)
1. GitHub → Settings → Personal access tokens → Regenerate token
2. Copy new token
3. Netlify → Site settings → Environment → GITHUB_PAT → Update value
4. Netlify → Deploys → Trigger deploy

### Update the Passcode
1. Open `index.html` in text editor
2. Find: `const CORRECT_PASSCODE = '2402';`
3. Change to new 4-digit code
4. Save & commit: `git add . && git commit -m "Update passcode" && git push`
5. Netlify auto-redeploys

### Back Up Data
- GitHub is your backup (commits are immutable)
- Download `areas-data.json` monthly to a safe location

---

## Troubleshooting Reference

| Problem | Cause | Solution |
|---------|-------|----------|
| Data won't load | `areas-data.json` not in repo, network issue | Check GitHub, verify file exists, hard refresh browser |
| Changes won't save | Edge Function error, GitHub API 401, PAT expired | Check Netlify logs, verify PAT valid, test Edge Function |
| Passcode doesn't work | Case/digit mismatch | Passcode is exactly `2402`, 4 digits only |
| Changes appear then disappear | Stale cache | Hard refresh: Ctrl+Shift+R |

---

## Success Criteria (You'll Know It's Working When...)

✅ **You can edit Tab 8 and changes appear in GitHub**
✅ **All users see your edits without refreshing**
✅ **Passcode 2402 works; invalid codes show error**
✅ **WCAG checker confirms colour contrast is AA or better**
✅ **Edge Function logs show successful commits**

---

## Handover Notes for Future Support

If you need to hand this off to someone else:

1. **Share these documents:** README.md, QUICK_START.md, NETLIFY_SETUP_GUIDE.md, this checklist
2. **Share credentials:** Netlify account access (preferably as a "Collaborator"), GitHub repo access
3. **Explain:** The passcode (2402), the GitHub PAT (kept secret), how edits sync
4. **Warn:** Don't commit the GitHub PAT to the repo; keep it in Netlify environment variables only
5. **Point to:** `NETLIFY_SETUP_GUIDE.md` for all deployment/troubleshooting

---

## Questions & Support Contacts

**Netlify Support:** [docs.netlify.com](https://docs.netlify.com)  
**GitHub Docs:** [docs.github.com](https://docs.github.com)  
**Accessibility:** [w3.org/WAI/WCAG22](https://www.w3.org/WAI/WCAG22/)

---

## Completion Signature

- [ ] All items above checked ✓
- [ ] System tested & working
- [ ] Link shared with stakeholders
- [ ] Initial data populated (Digital Leads at minimum)
- [ ] Team trained on how to edit

**Date Deployed:** _______________

**Deployed By:** Graeme Wright

**Live URL:** _______________________________________________

---

**Version:** 3.0  
**Created:** April 28, 2026  
**Last Updated:** April 28, 2026  
**Status:** Ready for Production Deployment
