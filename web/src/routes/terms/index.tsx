import { createFileRoute } from "@tanstack/react-router";
import { LegalDocumentPage } from "@/components/legal-document";
import { legalDocuments } from "@/content/legal";

export const Route = createFileRoute("/terms/")({
  head: () => ({
    meta: [
      { title: "Terms of Service · Checklist" },
      { name: "description", content: legalDocuments.terms.description },
    ],
  }),
  component: function TermsRoute() {
    return <LegalDocumentPage doc={legalDocuments.terms} />;
  },
});
