/** Keys must match server `AGREEMENT_CHECKBOX_FIELDS` for POST /api/onboarding/step1 */
export const AGREEMENT_CHECKBOX_FIELDS = [
  { key: "confirmAccuracy", label: "I confirm that all information I provide will be accurate" },
  { key: "confirmHmrcResponsibility", label: "I understand HMRC penalties remain my responsibility" },
  { key: "acceptMoa", label: "I accept the Master Onboarding Agreement" },
  { key: "acceptPrivacyPolicy", label: "I accept Privacy Policy & DPA" },
  { key: "acceptAml", label: "I agree to AML requirements" },
  { key: "acceptLiability", label: "I accept Zero Liability clause" },
  { key: "noAccountantAck", label: "I understand no accountant relationship exists" },
  { key: "electronicConsent", label: "I consent to electronic communication" },
  { key: "agreedAll", label: "I agree to all the above terms" },
];

export const AGREEMENT_CHECKBOX_KEYS = AGREEMENT_CHECKBOX_FIELDS.map((f) => f.key);

/** Step 1 UI: five mandatory confirmations; when all true, server receives every agreement boolean true */
export const MANDATORY_CONFIRMATION_ITEMS = [
  {
    id: "acceptMoaTnc",
    label:
      "I have read and accept all terms and conditions of this Master Onboarding Agreement",
  },
  {
    id: "acceptDataProtection",
    label:
      "I acknowledge and accept the data protection and privacy terms outlined in this agreement",
  },
  {
    id: "acceptServiceTerms",
    label:
      "I understand and accept the service terms, including fees and payment obligations",
  },
  {
    id: "ackClientResponsibilities",
    label:
      "I acknowledge my responsibilities as outlined in the Client Responsibilities Statement",
  },
  {
    id: "confirmAccurateInfo",
    label:
      "I confirm that I will provide accurate and complete information for all accounting services",
  },
];
