import { createFileRoute } from "@tanstack/react-router";
import { LegalDocumentPage } from "@/components/legal-document";
import { legalDocuments } from "@/content/legal";

export const Route = createFileRoute("/privacy/")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · Checklist" },
      { name: "description", content: legalDocuments.privacy.description },
    ],
  }),
  component: function PrivacyRoute() {
    return <LegalDocumentPage doc={legalDocuments.privacy} />;
  },
});
