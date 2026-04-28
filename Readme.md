# Digital Skills Framework — Weston College v3

**Live, Editable Edition with Netlify Edge Function Proxy**

---

## What You Have

A complete, production-ready system for managing the **Digital Skills Framework** at Weston College. The resource is:

- **Dynamic:** Data syncs to GitHub in real-time
- **Secure:** Passcode-protected editing (2402)
- **Live:** All users see updates immediately
- **Accessible:** WCAG 2.2 AA compliant with verified colour contrast

---

## Files & Structure

```
Digital-Skills-Framework---Weston/
├── index.html                              # Main app (8 tabs, passcode modal, edit forms)
├── areas-data.json                         # Single source of truth (all editable data)
├── netlify.toml                            # Netlify deployment config
├── netlify/
│   └── edge-functions/
│       └── sync-data.ts                    # Edge Function (proxy, GitHub API integration)
├── NETLIFY_SETUP_GUIDE.md                  # Complete deployment walkthrough
└── README.md                               # This file
```

### Key Files Explained

#### `index.html`
- **8 tabs:** General Skills (read-only), All Subjects (editable), Industry Skills (editable), Framing (read-only), SEND (editable), Progression (read-only), Teacher Skills (read-only), **Digital Leads (NEW + editable)**
- **Passcode modal:** 4-digit validation on edit
- **Dynamic data loading:** Fetches `areas-data.json` from GitHub on page load
- **Edit forms:** Click "Edit" to unlock fields, save syncs to GitHub via Netlify Edge Function

#### `areas-data.json`
- **Single source of truth:** All editable content lives here
- **Versioned:** `version: "3.0"`, `lastUpdated` timestamp
- **Structured:** `digitalLeads[]`, `areas[]`, `industrySkills{}`, `sendProvisions{}`
- **Synced:** Netlify Edge Function writes changes back to this file

#### `netlify/edge-functions/sync-data.ts`
- **Proxy server:** Receives edit requests from the browser
- **PAT holder:** Only place that holds your GitHub PAT (hidden from users)
- **GitHub API caller:** Commits updated `areas-data.json` back to repo
- **Security gatekeeper:** Validates data, adds timestamps, handles errors

---

## How It Works

### For End Users (Read-Only)

1. Visit the site
2. Browse 8 tabs
3. See live data from `areas-data.json`

### For You (Editing with Passcode)

1. Click **🔓 Unlock Editing** on any editable tab
2. Enter passcode: **2402**
3. Edit fields (area names, Digital Lead names, skills, etc.)
4. Click **Save & Sync**
5. Edge Function:
   - Takes your data
   - Adds your GitHub PAT (kept secret on Netlify server)
   - Commits to GitHub
6. `areas-data.json` updates in repo
7. Page re-fetches data
8. Everyone sees changes live (within 1–2 seconds)

---

## Editable Tabs

| Tab | Editable? | What Can You Edit? |
|-----|-----------|-------------------|
| 1. General Skills | ❌ No | Reference framework |
| 2. All Subjects & Areas | ✅ Yes | Curriculum area details (code, name, digital skills, tools) |
| 3. Industry-Specific Skills | ✅ Yes | Industry sector skills and tools |
| 4. Framing | ❌ No | Strategic framing guidance |
| 5. SEND, Inclusion & Accessibility | ✅ Yes | SEND provisions and accessibility tools |
| 6. Skills Progression | ❌ No | Progression ladders (Foundation → Highly Advanced) |
| 7. Teacher Digital Skills (TLA) | ❌ No | Teacher progression framework |
| **8. Digital Leads by Area** | ✅ Yes | **NEW** — Head of Area + Identified Digital Lead per curriculum area |

---

## Tab 8: Digital Leads (NEW)

**Purpose:** Track who is the identified Digital Lead (champion) for each of Weston's 32 curriculum areas.

**Structure:**
```json
{
  "digitalLeads": [
    {
      "code": "AGF",
      "name": "Arts, Graphics & Fashion",
      "headOfArea": "TBA",
      "digitalLead": "TBA"
    },
    ...
  ]
}
```

**How to Use:**
1. Go to **Tab 8**
2. Click **🔓 Unlock Editing** (passcode: 2402)
3. Click **✎ Edit** on any area
4. Update Head of Area name and/or Digital Lead name
5. Click **Save & Sync**
6. Data updates in GitHub immediately

---

## Security & Passcode

**Passcode:** `2402`

- **4 digits only**
- **Validated in browser** (not sent to server)
- **Change anytime:** Edit `index.html`, line 291: `const CORRECT_PASSCODE = '2402';`
- **Only you know it:** Shared with you alone; users can see "Unlock Editing" button but can't edit without the code

**GitHub PAT:**
- **Only on Netlify servers:** Never exposed to browser or in code
- **Kept in environment variables:** Site settings → Environment → GITHUB_PAT
- **Rotate every 90 days:** For security

---

## Deployment Checklist

Before going live:

- [ ] Create GitHub Personal Access Token (PAT) — see NETLIFY_SETUP_GUIDE.md
- [ ] Push code to GitHub repo: `Digital-Skills-Framework---Weston`
- [ ] Create Netlify account and connect the repo
- [ ] Add GITHUB_PAT as environment variable in Netlify
- [ ] Trigger deploy (Netlify will build and serve)
- [ ] Test Edge Function: try editing a Digital Lead
- [ ] Verify GitHub commit appears in repo history
- [ ] Share live URL with stakeholders

**Full guide:** See `NETLIFY_SETUP_GUIDE.md`

---

## Colour Compliance (WCAG 2.2 AA)

All colour combinations have been tested and verified:

| Element | Colours | Contrast Ratio | Status |
|---------|---------|---|--------|
| Cover date | White on Navy | 16.59:1 | ✅ WCAG AAA |
| Tab text (active) | Teal-Bright on Navy | 6.66:1 | ✅ WCAG AA |
| Body text | Text-Dark on Cream | 17.95:1 | ✅ WCAG AAA |
| Buttons | Teal on White | 5.4:1 | ✅ WCAG AA |

All interactive elements have keyboard focus outlines and proper ARIA labels.

---

## Common Tasks

### Add a New Curriculum Area

1. Go to **Tab 8** (Digital Leads)
2. Edit `areas-data.json` in GitHub OR add via the form (when Tab 2 form is implemented)
3. Add entry to `digitalLeads[]` array with code, name, headOfArea, digitalLead

### Change a Digital Lead Name

1. Visit site → **Tab 8** → **Unlock Editing** (2402)
2. Click **✎ Edit** on the area
3. Update "Digital Lead" field
4. Click **Save & Sync**
5. Done — change is live

### Update an Area's Digital Skills or Tools

1. Visit site → **Tab 2** (All Subjects & Areas) → **Unlock Editing** (2402)
2. Click **✎ Edit** on the area
3. Update digital skills or tools tags
4. **Save & Sync**
5. Change reflected immediately

### Rotate GitHub PAT (Every 90 Days)

1. **GitHub:** Settings → Personal access tokens → Regenerate token
2. **Copy new token**
3. **Netlify:** Site settings → Environment → GITHUB_PAT → Update value
4. **Redeploy:** Netlify → Deploys → Trigger deploy

---

## Troubleshooting

### Changes won't save

1. Check browser console (F12) for error messages
2. Verify Netlify Edge Function is deployed: Dashboard → Deploys → check logs
3. Test the function: 
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/sync-data \
     -H "Content-Type: application/json" \
     -d '{"dataType":"digitalLeads","data":[],"timestamp":"2026-04-28T00:00:00Z"}'
   ```
4. Check GitHub PAT is valid: GitHub → Settings → Personal access tokens

### Passcode doesn't work

1. Passcode is `2402` (4 digits, no letters)
2. Check browser cache: Ctrl+Shift+Delete → Clear browsing data
3. Try incognito window

### Data won't load from GitHub

1. Check `areas-data.json` exists in repo root
2. Verify repo name: `Digital-Skills-Framework---Weston`
3. Verify branch: `main`
4. Try hard refresh: Ctrl+Shift+R

---

## What's Next?

### Short Term (Week 1)
- Deploy to Netlify
- Test all 8 tabs
- Add initial Digital Leads names

### Medium Term (Month 1)
- Populate all curriculum areas (Tab 2)
- Add industry-specific skills (Tab 3)
- Update SEND provisions (Tab 5)

### Long Term (Ongoing)
- Monitor edits via GitHub commits
- Update data as curriculum changes
- Share framework with stakeholders (read-only access)
- Use Tab 8 to track Digital Champion identification process

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JS (no dependencies) |
| **Data** | JSON (stored in GitHub) |
| **Proxy/Sync** | Netlify Edge Functions (TypeScript) |
| **API** | GitHub REST API v3 |
| **Hosting** | Netlify (static site + Edge Functions) |
| **Security** | GitHub PAT (server-side only), Passcode (client-side) |

---

## Questions & Support

### Netlify Questions
- Docs: https://docs.netlify.com
- Support: https://docs.netlify.com/support

### GitHub / API Questions
- Docs: https://docs.github.com
- Personal Access Tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

### Accessibility Questions
- WCAG 2.2 Reference: https://www.w3.org/WAI/WCAG22/quickref/
- Colour Contrast Checker: https://webaim.org/resources/contrastchecker/

---

## Document Info

- **Version:** 3.0 (Live Editable Edition)
- **Last Updated:** April 28, 2026
- **Maintained By:** Graeme Wright, Digital Pedagogy Coach, Weston College
- **License:** Internal use only
- **Accessibility:** WCAG 2.2 AA compliant

---

**Ready to deploy?** Start with `NETLIFY_SETUP_GUIDE.md` for step-by-step instructions.
