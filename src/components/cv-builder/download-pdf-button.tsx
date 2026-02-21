"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useCvEditor } from "@/components/cv-builder/cv-editor-context";
import { ProfessionalPdf } from "./pdf/professional-pdf";
import { Button } from "@/components/ui/button";

export default function DownloadPdfButton() {
  const { cvData, language } = useCvEditor();

  // All templates map to the same ATS-compliant structure for now in PDF format
  const PdfDoc = <ProfessionalPdf data={cvData} language={language} />;

  const sanitizedName = (cvData.personalInfo.fullName || "Untitled").replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${sanitizedName}_CV.pdf`;

  return (
    <PDFDownloadLink document={PdfDoc} fileName={filename}>
      {({ loading }) => (
        <Button disabled={loading} className="bg-black text-white hover:bg-gray-800">
          {loading ? "Generating PDF (< 5s)..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
