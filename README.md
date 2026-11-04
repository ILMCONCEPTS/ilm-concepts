# ILM Concepts website
Static HTML/CSS/JS, no build step. Open index.html or serve: `python3 -m http.server 8000`.
## Go live
- `js/config.js` → `FORM_ENDPOINT` = `https://formsubmit.co/ajax/i.l.mgmt.services@gmail.com` (FormSubmit.co, free, no account). Empty = demo mode, nothing sent.
## Form email delivery (FormSubmit.co)
- All four forms (maintenance, estimate, junk removal, home modification/contract) email i.l.mgmt.services@gmail.com with a per-form subject, table layout, labeled fields, and Reply-To set to the customer's email. A hidden honeypot field (`_honey`) filters bots; FormSubmit's captcha is off.
- **One-time activation:** the first real submission sends an activation email to the inbox. Click "Activate Form" or nothing is delivered. Until then the site may show an error, and customers see the phone number (559) 344-9420.
- **Uploads:** FormSubmit's AJAX API doesn't take attachments. When a customer attaches files, the form is sent as a normal multipart POST to `https://formsubmit.co/i.l.mgmt.services@gmail.com` (files attached), and FormSubmit redirects back to the page with `?sent=1`, which shows the success screen. That redirect only works when the site is served over http(s), not opened as a file://. Attachment size and type limits are set by FormSubmit (around 10 MB total on their free tier). Large files may be rejected.
- Errors (network failure, or a response that isn't `success: true`) show an error with the phone number. The form never shows success falsely in AJAX mode.
- Free third-party service: no delivery guarantee or SLA, and emails may land in Spam at first. For a sturdier setup, move to a paid form service or a small backend.
- `js/config.js` → `PAYMENT_LINK` (Stripe Payment Link / Square checkout URL). Empty = placeholder, no payment.
- Contact info: phone (559) 344-9420, email i.l.mgmt.services@gmail.com, business hours 9:00 am – 4:30 pm, emergency maintenance 24 hours a day (no street address shown).
- - `contract.html`: Home Modification Request (a request/work authorization form for estimates, not a binding contract).
- Remaining placeholder (class `ph`): CSLB license #.
