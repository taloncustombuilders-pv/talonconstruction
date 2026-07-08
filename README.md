# Talon Construction Company — Landing Page

Static landing page for Cloudflare Pages. Built by Visibility Street Media & Marketing.

## Structure

```
talon-landing/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/
│   ├── talon-logo.png      (transparent bg, trimmed)
│   ├── hero-1920.jpg       (desktop hero)
│   └── hero-1024.jpg       (mobile hero)
└── functions/
    └── api/lead.js         (Cloudflare Pages Function — lead form endpoint)
```

## Deploy to Cloudflare Pages

**Option 1 — Direct upload:** Cloudflare dashboard → Workers & Pages → Create → Pages → Upload assets → drag the whole `talon-landing` folder in. Note: direct upload does NOT run Pages Functions — use Option 2 if you want the built-in form endpoint, or point `FORM_ENDPOINT` in `js/main.js` at Formspree/Web3Forms.

**Option 2 — Git deploy (recommended):** Push this folder to a GitHub repo, connect it in Pages. No build command; output directory is `/`. Pages Functions in `/functions` deploy automatically.

## Lead form (100% free — Google Sheet + email)

The form posts to `/api/lead` (Cloudflare Pages Function), which forwards each
lead to a Google Apps Script webhook. Leads are logged to a Google Sheet and
emailed to you. No paid services.

Full setup steps are in the header of `setup/google-apps-script-lead-receiver.gs`.
Short version: create a Google Sheet → Extensions → Apps Script → paste that file →
Deploy as Web app (Execute as Me / access: Anyone) → copy the /exec URL → set it as
`LEAD_WEBHOOK_URL` in Cloudflare Pages env variables → redeploy → send a test lead.

Requires Git deploy (Pages Functions don't run on drag-and-drop uploads).
Until `LEAD_WEBHOOK_URL` is set, visitors submitting the form see a phone/email
fallback — nothing is silently dropped.

## Notes

- Brand tokens from `Talon_brand_development.docx`: navy `#151B2A`, charcoal `#242424`, bone `#F4F0E6`, aged gold `#C8A45A`, oxblood `#8B1E2D`.
- Fonts: Bitter (display slab serif) + Inter (body), Google Fonts.
- Custom domain: add in Pages → Custom domains. Keep mail DNS records grey-cloud per usual Talon DNS rules.
