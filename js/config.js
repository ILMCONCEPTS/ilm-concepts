/* ILM Concepts site configuration.
 * FORM_ENDPOINT: Web3Forms submit URL (https://api.web3forms.com/submit).
 * FORM_ACCESS_KEY: public Web3Forms access key (safe to expose in front-end
 *   source). The recipient inbox is configured in the Web3Forms dashboard for
 *   that key — do not put the destination email in this file. Set either
 *   FORM_ENDPOINT or FORM_ACCESS_KEY to "" to put forms in DEMO MODE
 *   (nothing sent).
 * PAYMENT_LINK: hosted checkout URL (Stripe Payment Link / Square). Empty =
 *   placeholder. This site never collects card numbers itself. */
window.ILM_CONFIG = {
  FORM_ENDPOINT: "https://api.web3forms.com/submit",
  FORM_ACCESS_KEY: "ff7411db-daef-4b71-8954-5bf70fdce0de",
  PAYMENT_LINK: ""
};
