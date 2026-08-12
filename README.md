# Friend Pocket — Demo Website

A professional prototype website for **Friend Pocket**, a
financial support brand. Built with plain HTML5, CSS3 and
vanilla JavaScript — no build step required.

> **This is a demo.** Business details, regulatory information,
> interest rates and loan limits shown across the site are
> placeholders and must be verified/configured before any
> production use. See `disclaimer.html` for the full notice.

---

## Features

- Responsive marketing site: home, loan products, EMI calculator,
  eligibility checker, multi-step application, documents, FAQ,
  about, contact, privacy/terms/disclaimer.
- Fully working EMI calculator (reducing-balance formula).
- Demo eligibility checker with a non-committal preliminary
  indication (not a credit decision).
- Multi-step application form that generates a demo application
  ID (`FP-DEMO-YYYY-000N`) and stores submissions locally.
- Demo admin portal (`admin-login.html` / `admin-dashboard.html`)
  with a seeded set of demo applications, search, status filter,
  and status-change modal.
- Shared header/footer loaded from `partials/` so every page
  stays in sync.
- Central configuration object (`js/config.js`) for business
  details and loan parameters.

## How to run

1. Open the `friend-pocket/` folder in VS Code.
2. Install the **Live Server** extension if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.

The site uses `fetch()` to load the shared header/footer, so it
needs to be served over `http://` (Live Server does this
automatically) rather than opened directly as a `file://` URL.

## How to customize

### Business details
Edit `js/config.js` — this single object drives the business
name, phone, WhatsApp, email, address, and demo loan parameters
(`interestRate`, `minLoan`, `maxLoan`, `minTenure`, `maxTenure`)
used across the calculator, eligibility checker and product
pages.

### Interest rate & loan limits
Update `interestRate`, `minLoan`, `maxLoan`, `minTenure`,
`maxTenure` in `js/config.js`. The calculator's slider ranges are
set directly in `calculator.html` (`min`/`max` attributes on the
range inputs) — update these to match if you change the config
values.

### WhatsApp button
Set `whatsapp` in `js/config.js` to a full international number
with no symbols (e.g. `"919999999999"`). Leave it blank to keep
the floating button and Contact page WhatsApp link disabled.

### Connecting Google Apps Script / Google Sheets (future)
`js/application.js` contains a `submitApplication(data)` function
that currently only logs to the console (data is already saved to
`localStorage`). To connect a real backend:

1. Build a Google Apps Script Web App that accepts a POST request
   and appends a row to a Google Sheet.
2. Replace the body of `submitApplication()` in
   `js/application.js` with a `fetch()` POST call to that Apps
   Script URL (an example is commented directly above the
   function).
3. Trigger an email notification from within the Apps Script
   using the submitted fields (application ID, name, mobile,
   amount, tenure, date).

### Admin demo login
Demo credentials live in `js/admin.js` (`DEMO_USER` /
`DEMO_PASS`). This is **not** secure authentication — replace with
real backend auth before production use.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", select the branch (e.g. `main`)
   and root folder, then save.
4. Your site will be published at
   `https://<username>.github.io/<repo-name>/`.

## Production security requirements

Before any production launch:

- Replace all placeholder business, contact and regulatory
  information.
- Replace `localStorage`-based demo storage with a secure backend
  and database.
- Replace the demo admin login with real authentication
  (hashed credentials, session management, HTTPS-only).
- Never collect or store real PAN, Aadhaar, bank account numbers,
  or other sensitive documents in the frontend.
- Have all legal pages (Privacy Policy, Terms & Conditions,
  Disclaimer) reviewed by qualified legal counsel.
- Verify and obtain any required regulatory registrations before
  using terms like "loan," "interest," or presenting the site as
  a live financial service.

## File structure

```
friend-pocket/
├── index.html, about.html, loans.html, eligibility.html,
│   calculator.html, apply.html, documents.html, faq.html,
│   contact.html, privacy.html, terms.html, disclaimer.html
├── admin-login.html, admin-dashboard.html
├── partials/          shared header.html / footer.html
├── css/                style.css, responsive.css
├── js/                 config.js, main.js, calculator.js,
│                       eligibility.js, application.js, admin.js
├── assets/             logo/, images/, icons/
├── manifest.json, service-worker.js
└── README.md
```


## Single-page demo update

The main public experience is now available from `index.html` as a
single-page website. The navigation scrolls to sections on the same page,
while the admin portal remains separate (`admin-login.html` and
`admin-dashboard.html`).

A configurable illustrative demo application/registration fee is available
in `js/config.js` as `applicationFee`. Do not treat configured values as final
business terms.
