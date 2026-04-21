import { Card } from "antd";

export function AgreementViewer() {
  return (
    <Card className="h-64 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 text-sm text-zinc-200">
      <p className="mb-2 font-semibold text-white">Memorandum of Agreement (MOA)</p>
      <p className="mb-2">This MOA governs how Ledgex provides accounting and tax services to your business.</p>
      <p className="mb-2">It covers responsibilities, data handling, and limitations of liability for both parties.</p>
      <p className="mb-2">By accepting, you confirm you&apos;re authorised to enter into this agreement on behalf of the business.</p>
    </Card>
  );
}
