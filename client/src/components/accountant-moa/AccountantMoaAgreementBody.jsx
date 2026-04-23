import React from "react";
import { Typography } from "antd";

export default function AccountantMoaAgreementBody({ moa, scrollRef, onScroll }) {
  return (
    <div>
      <Typography.Title level={4} className="!mb-1">
        {moa.title}
      </Typography.Title>
      <Typography.Text type="secondary" className="text-sm">
        Version {moa.version} · Effective {moa.effectiveDate}
      </Typography.Text>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="mt-4 max-h-[min(52vh,28rem)] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/80 p-4"
        role="region"
        aria-label="Agreement text"
      >
        {moa.sections.map((section) => (
          <section key={section.title} className="mb-5 last:mb-0">
            <Typography.Title level={5} className="!mb-2 !text-base">
              {section.title}
            </Typography.Title>
            {section.content.map((p, idx) => (
              <Typography.Paragraph key={`${section.title}-${idx}`} className="!mb-2 text-slate-800 last:!mb-0">
                {p}
              </Typography.Paragraph>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
