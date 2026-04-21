import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getBusinessProfile } from "../../api/businessProfile.api";
import { getBusinessProfileResumePath } from "../../utils/businessProfilePaths";

/** /business-profile → resume at the correct step, or dashboard if complete */
export default function BusinessProfileRedirect() {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getBusinessProfile();
        if (cancelled) return;
        const path = getBusinessProfileResumePath(data.profile);
        setTarget(path ?? "/dashboard");
      } catch {
        if (!cancelled) setTarget("/business-profile/step1");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (target === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  return <Navigate to={target} replace />;
}
