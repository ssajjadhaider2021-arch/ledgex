export const accountantMOA_v1 = {
  version: "1.0",
  effectiveDate: "2026-04-21",
  title: "Master Accountant Onboarding Agreement (M-MOA)",

  sections: [
    {
      title: "1. INTRODUCTION & PARTIES",
      content: [
        'This Master Accountant Onboarding Agreement (“Agreement”, “M-MOA”) is made between:',
        '(1) LedgeX Ltd (“LedgeX”, “we”, “us”, “our”), and',
        '(2) The Accountant or Accounting Firm (“Firm”, “you”, “your”).',
        "1.1 Purpose: This Agreement governs the Firm's use of the LedgeX Platform to manage clients, onboarding of the Firm's clients, compliance with data protection and AML laws, Platform access and security, pricing, billing, and service limitations, and all legal rights and responsibilities between LedgeX and the Firm.",
        "1.2 Binding Effect: By creating a Firm account, onboarding clients, accessing the Platform, or signing electronically, the Firm accepts this Agreement as legally binding.",
        "1.3 Entire Legal Framework: This Agreement consolidates Platform Terms & Conditions, Accountant Partner Terms, Data Processing Agreement (DPA), Data Processing Register, AML Requirements, SAR Procedure, Zero Liability Framework, Indemnity Clause, Director/Shareholder Protection Clause, Virtual Office Terms (if applicable), and Pricing, Billing & Termination Terms. This Agreement also serves as the Engagement Letter between LedgeX and the Firm.",
      ],
    },
    {
      title: "2. DEFINITIONS",
      content: [
        "“Firm” – the accounting practice using LedgeX.",
        "“Client” – the Firm's customer whose data is processed.",
        "“Platform” – the LedgeX SaaS system.",
        "“Controller” – the Firm, for its client data.",
        "“Processor” – LedgeX, acting under Firm instructions.",
        "“Sub-Processor” – Supabase, Cloudflare, Xama, Microsoft, Google.",
      ],
    },
    {
      title: "3. SCOPE OF USE",
      content: [
        "3.1 Permitted Uses: The Firm may use the Platform to manage multiple client accounts, prepare VAT, CT600, SA100, Accounts & CIS filings, store documents and maintain audit trails, perform AML onboarding via Xama, and use automated bookkeeping tools.",
        "3.2 Excluded Uses: The Firm must not use LedgeX for tax avoidance schemes, unlawful activities, specialist advisory services not agreed separately, or services requiring FCA authorisation.",
      ],
    },
    {
      title: "4. ROLES UNDER GDPR",
      content: [
        "The Firm is the Data Controller for its client data.",
        "LedgeX is the Data Processor, acting on Firm instructions.",
        "Sub-Processors include Supabase, Cloudflare, Xama, Microsoft and Google.",
        "The Firm consents to all approved sub-processors.",
      ],
    },
    {
      title: "5. AML / KYC",
      content: [
        "The Firm must: perform AML checks on its own clients, use Xama where required, maintain AML records, monitor high-risk clients, and comply with the Money Laundering Regulations 2017.",
        "LedgeX performs AML checks only for Firm-level onboarding.",
      ],
    },
    {
      title: "6. ACCOUNTING FIRM RESPONSIBILITIES",
      content: [
        "The Firm agrees to: obtain client consent before adding them to LedgeX, ensure all input data is accurate, complete and lawful, manage deadlines and approvals, review all filings before submission, maintain statutory records, and perform AML checks on all clients.",
        "LedgeX does not verify, audit or validate Firm-provided data.",
      ],
    },
    {
      title: "7. LEDGEX RESPONSIBILITIES",
      content: [
        "LedgeX will: maintain secure systems with encryption and MFA, process data in accordance with the DPA, maintain backups and audit trails, and provide Platform access during normal operation.",
        "LedgeX does not: audit the Firm, verify Firm inputs, detect fraud, or ensure record completeness.",
      ],
    },
    {
      title: "8. LIMITATIONS & EXCLUSIONS",
      content: [
        "LedgeX is not liable for: HMRC penalties for the Firm or its clients, incorrect or incomplete data supplied by the Firm, late approvals or missed deadlines, outages of HMRC, Companies House, Xama or bank-feed providers, automation errors (OCR, AI, categorisation), incomplete or corrupted records supplied by the Firm, or indirect, consequential or financial losses.",
      ],
    },
    {
      title: "9. INDEMNITY",
      content: [
        "The Firm agrees to indemnify, defend and hold harmless LedgeX Ltd and its directors and shareholders from all claims, losses, penalties, liabilities, and legal costs arising from: inaccurate, incomplete or misleading information supplied by the Firm or its clients; late submission of data or approvals; filing errors caused by Firm inputs; AML failures by the Firm; misuse of the Platform; errors by Firm staff or contractors; claims brought by the Firm's clients; and regulatory penalties relating to the Firm's conduct.",
        "This indemnity survives termination of the Agreement.",
      ],
    },
    {
      title: "10. DIRECTOR & SHAREHOLDER PROTECTION",
      content: [
        "No director, shareholder, employee or contractor of LedgeX accepts personal liability for any act or omission.",
        "All liability rests solely with LedgeX Ltd.",
      ],
    },
    {
      title: "11. NO-RELIANCE & PROFESSIONAL JUDGEMENT",
      content: [
        "The Firm acknowledges: the Platform provides tools, not professional judgement; automated outputs require manual review; software results cannot be relied upon without checking.",
        "The Firm retains full professional responsibility for all accounting and tax outputs.",
      ],
    },
    {
      title: "12. CLIENT-OF-FIRM EXCLUSION",
      content: [
        "The Firm's clients have no rights, claims or recourse against LedgeX.",
        "All claims must be directed to the Firm.",
      ],
    },
    {
      title: "13. LIABILITY CAP",
      content: [
        "LedgeX's total liability is limited to the subscription fees paid by the Firm in the three months preceding the event giving rise to the claim.",
      ],
    },
    {
      title: "14. PRICING",
      content: [
        "Monthly Firm subscription.",
        "Additional paid add-ons available.",
        "No refunds for prior billing periods.",
        "Suspension for non-payment.",
      ],
    },
    {
      title: "15. TERMINATION",
      content: [
        "Either party may terminate with 30 days' notice.",
        "Immediate termination may occur for: AML/KYC failure, unlawful activity, non-payment, regulatory concerns, or breach of Agreement.",
      ],
    },
    {
      title: "16. SIGNATURE REQUIREMENT",
      content: [
        "The Firm must sign this Agreement electronically before gaining access to the LedgeX accountant dashboard.",
      ],
    },
    {
      title: "17. DECLARATIONS",
      content: [
        "The Firm confirms: it is authorised to enter this Agreement; this Agreement serves as the Engagement Letter with LedgeX; LedgeX is the Data Processor for client data; it accepts the indemnity and liability framework; all client data provided will be accurate and complete; it will comply with AML/CTF requirements; it consents to approved sub-processors; LedgeX is not responsible for HMRC penalties; it accepts the pricing and billing terms; and it consents to electronic signatures.",
      ],
    },
  ],
};