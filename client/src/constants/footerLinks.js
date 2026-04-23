/** Footer link rows: label + route. Pricing points at product pricing; others are legal/info placeholders. */
export const FOOTER_LINK_ITEMS = [
  { label: "Privacy Policy", to: "/legal/privacy-policy" },
  { label: "Terms of Service", to: "/legal/terms-of-service" },
  { label: "Platform Terms & Conditions", to: "/legal/platform-terms" },
  { label: "Referral Terms & Conditions", to: "/legal/referral-terms" },
  { label: "Cookie Policy", to: "/legal/cookie-policy" },
  { label: "GDPR", to: "/legal/gdpr" },
  { label: "DPA", to: "/legal/dpa" },
  { label: "Data Processing Register", to: "/legal/data-processing-register" },
  { label: "Complaints", to: "/legal/complaints" },
  { label: "AML Policy", to: "/legal/aml-policy" },
  { label: "Disclaimer", to: "/legal/disclaimer" },
  { label: "SAR", to: "/legal/sar" },
  { label: "Backup Plan", to: "/legal/backup-plan" },
  { label: "Scope of Service", to: "/legal/scope-of-service" },
  { label: "Pricing", to: "/pricing" },
];

/** Human-readable H1 for legal placeholder pages, keyed by path segment. */
export const LEGAL_PAGE_TITLES = {
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service",
  "platform-terms": "Platform Terms & Conditions",
  "referral-terms": "Referral Terms & Conditions",
  "cookie-policy": "Cookie Policy",
  gdpr: "GDPR",
  dpa: "Data Processing Agreement (DPA)",
  "data-processing-register": "Data Processing Register",
  complaints: "Complaints",
  "aml-policy": "AML Policy",
  disclaimer: "Disclaimer",
  sar: "Subject Access Request (SAR)",
  "backup-plan": "Backup Plan",
  "scope-of-service": "Scope of Service",
};
