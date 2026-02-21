"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { CvData } from "@/lib/cv/default-data";
import { type TemplateId, DEFAULT_TEMPLATE_ID } from "@/lib/templates/registry";

export type CvEditorContextType = {
  cvData: CvData;
  updateCvData: (data: Partial<CvData>) => void;
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
};

const CvEditorContext = createContext<CvEditorContextType | null>(null);

export function CvEditorProvider({
  initialData,
  initialLanguage,
  initialTemplateId,
  children,
}: {
  initialData: CvData;
  initialLanguage: "id" | "en";
  initialTemplateId: TemplateId;
  children: React.ReactNode;
}) {
  const [cvData, setCvData] = useState<CvData>(initialData);
  const [language, setLanguage] = useState<"id" | "en">(initialLanguage);
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplateId || DEFAULT_TEMPLATE_ID);
  const [jobDescription, setJobDescription] = useState<string>("");

  const updateCvData = useCallback((newData: Partial<CvData>) => {
    setCvData((prev) => ({ ...prev, ...newData }));
  }, []);

  return (
    <CvEditorContext.Provider
      value={{ cvData, updateCvData, language, setLanguage, templateId, setTemplateId, jobDescription, setJobDescription }}
    >
      {children}
    </CvEditorContext.Provider>
  );
}

export function useCvEditor() {
  const context = useContext(CvEditorContext);
  if (!context) throw new Error("useCvEditor must be used within CvEditorProvider");
  return context;
}
