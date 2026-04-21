import React from "react";
import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Platform Terms & Conditions",
  "Referral Terms & Conditions",
  "Cookie Policy",
  "GDPR",
  "DPA",
  "Data Processing Register",
  "Complaints",
  "AML Policy",
  "Disclaimer",
  "SAR",
  "Backup Plan",
  "Scope of Service",
  "Pricing",
];

export default function GlobalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/90">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm sm:px-6 lg:px-8">
        <p className="font-medium text-slate-700">© 2025 LedgeX Ltd • Smart Accounting. Simplified.</p>
        <p className="mt-2 text-slate-600">Registered in England & Wales • Company No. 16865371</p>
        <p className="mt-4 text-xs leading-6 text-slate-500 sm:text-sm">
          {FOOTER_LINKS.map((label, index) => (
            <React.Fragment key={label}>
              {label === "Pricing" ? (
                <Link to="/pricing" className="hover:text-slate-700">
                  {label}
                </Link>
              ) : (
                <button type="button" className="hover:text-slate-700">
                  {label}
                </button>
              )}
              {index < FOOTER_LINKS.length - 1 ? <span className="mx-2 text-slate-400">|</span> : null}
            </React.Fragment>
          ))}
        </p>
      </div>
    </footer>
  );
}
