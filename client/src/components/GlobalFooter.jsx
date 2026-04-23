import React from "react";
import { Link } from "react-router-dom";
import { FOOTER_LINK_ITEMS } from "../constants/footerLinks";

export default function GlobalFooter() {
  return (
    <footer className="border-t border-slate-200/60 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-600">
          Registered in England &amp; Wales • Company No. 16865371
        </p>
        <nav
          className="mx-auto mt-6 max-w-5xl text-center text-xs leading-6 text-slate-500 sm:text-sm"
          aria-label="Legal and policies"
        >
          {FOOTER_LINK_ITEMS.map((item, index) => (
            <React.Fragment key={item.to + item.label}>
              <Link
                to={item.to}
                className="font-medium text-slate-600 underline-offset-2 transition hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600/50"
              >
                {item.label}
              </Link>
              {index < FOOTER_LINK_ITEMS.length - 1 ? (
                <span className="mx-2 text-slate-300" aria-hidden>
                  |
                </span>
              ) : null}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </footer>
  );
}
