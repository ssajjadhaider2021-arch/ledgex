import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getBusinessProfile } from "../../api/businessProfile.api";
import {
  getBusinessProfileResumePath,
  businessProfileStepLabel,
} from "../../utils/businessProfilePaths";

export default function DashboardHome() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(undefined);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "client") {
      setProfile(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getBusinessProfile();
        if (!cancelled) setProfile(data.profile ?? null);
      } catch {
        if (!cancelled) {
          setProfile(null);
          setLoadError("Could not load business profile.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const resumePath =
    user?.role === "client" && profile !== undefined
      ? getBusinessProfileResumePath(profile)
      : null;
  const profileComplete =
    user?.role === "client" &&
    profile !== undefined &&
    profile !== null &&
    Number(profile.completedStep ?? 0) >= 5;

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-600">
        Use the sidebar to open account areas. Complete business information when you&apos;re ready.
      </p>

      {user?.role === "client" ? (
        <section
          className={`rounded-2xl border p-6 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/5 sm:p-8 ${
            profileComplete
              ? "border-emerald-200 bg-emerald-50/90"
              : "border-amber-200 bg-amber-50/95"
          }`}
          aria-labelledby="biz-profile-heading"
        >
          <h2 id="biz-profile-heading" className="text-lg font-semibold text-slate-900">
            Business information
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {profileComplete
              ? "Your business profile wizard is complete. You can review or update earlier steps any time."
              : "Complete the short multi-step form (business type, VAT, payroll, bookkeeping). This is required for accurate accounting setup."}
          </p>

          {loadError ? (
            <p className="mt-3 text-sm text-red-700">{loadError}</p>
          ) : null}

          {profile === undefined ? (
            <p className="mt-4 text-sm text-slate-600">Checking profile…</p>
          ) : profileComplete ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/business-profile/step1"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
              >
                Review / edit business profile
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              <Link
                to={resumePath || "/business-profile/step1"}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 sm:w-auto"
              >
                {resumePath
                  ? `Continue — ${businessProfileStepLabel(resumePath) || "business profile"}`
                  : "Start business profile"}
              </Link>
              <p className="mt-3 text-xs text-slate-600">Continues at the next incomplete step.</p>
            </div>
          )}
        </section>
      ) : (
        <p className="text-sm text-slate-600">You are logged in.</p>
      )}
    </div>
  );
}
