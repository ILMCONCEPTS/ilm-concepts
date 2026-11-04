/* ILM Concepts site configuration.
 * FORM_ENDPOINT: FormSubmit.co AJAX endpoint that emails submissions to
 *   i.l.mgmt.services@gmail.com (no account needed). The FIRST submission
 *   triggers a one-time activation email to that inbox; click "Activate"
 *   or nothing will be delivered. Set to "" to put forms back in DEMO MODE
 *   (nothing sent).
 * PAYMENT_LINK: hosted checkout URL (Stripe Payment Link / Square). Empty =
 *   placeholder. This site never collects card numbers itself. */
window.ILM_CONFIG = {
  FORM_ENDPOINT: "https://formsubmit.co/ajax/i.l.mgmt.services@gmail.com",
  PAYMENT_LINK: ""
};
