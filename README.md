# ILM Concepts website
Static HTML/CSS/JS, no build step. Open index.html or serve: `python3 -m http.server 8000`.
## Go live
- `js/config.js` → `FORM_ENDPOINT` = `https://api.web3forms.com/submit` and `FORM_ACCESS_KEY` = the public Web3Forms access key (recipient inbox is set in the Web3Forms dashboard). Empty either value = demo mode, nothing sent.
## Form email delivery (Web3Forms)
- All four forms (maintenance, estimate, junk removal, home modification/contract) submit via AJAX to Web3Forms with a per-form subject, labeled fields, `from_name` = ILM Concepts, and `replyto` set to the customer's email. A hidden honeypot field (`_honey`) filters bots client-side.
- The destination email is **not** in page source; it is bound to the access key in the Web3Forms dashboard.
- **Uploads:** Web3Forms attachments are Pro-only. On the free plan, file inputs are stripped and a note is added that photos were selected but not uploaded — contact the visitor for photos. There is no native redirect / `_next` path.
- Errors (network failure, or a response that isn't `success: true`) show an error with the phone number. The form never shows success falsely in AJAX mode.
- Free third-party service: no delivery guarantee or SLA, and emails may land in Spam at first. For a sturdier setup, move to a paid form service or a small backend.
- `js/config.js` → `PAYMENT_LINK` (Stripe Payment Link / Square checkout URL). Empty = placeholder, no payment.
- Contact info: phone (559) 344-9420, email i.l.mgmt.services@gmail.com, business hours 9:00 am – 4:30 pm, emergency maintenance 24 hours a day (no street address shown).
- `contract.html`: Home Modification Request (a request/work authorization form for estimates, not a binding contract).
- Remaining placeholder (class `ph`): CSLB license #.

Redeploy kick 2026-11-05T19:53Z
unlock2 19:55:06
