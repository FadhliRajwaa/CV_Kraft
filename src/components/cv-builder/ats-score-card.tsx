"use client";

import { useState } from "react";
import { useCvEditor } from "@/components/cv-builder/cv-editor-context";
import { calculateAtsScore } from "@/lib/cv/ats-calculator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ATSScoreCard() {
  const { cvData, jobDescription, setJobDescription } = useCvEditor();
  const [tempJd, setTempJd] = useState(jobDescription);
  const [open, setOpen] = useState(false);

  const score = calculateAtsScore(cvData, jobDescription);

  const handleSaveJd = () => {
    setJobDescription(tempJd);
    setOpen(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "green": return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "yellow": return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "orange": return "text-orange-700 bg-orange-100 border-orange-200";
      case "red":
      default: return "text-red-700 bg-red-100 border-red-200";
    }
  };

  const getProgressColor = (cat: string) => {
    switch (cat) {
      case "green": return "bg-emerald-500";
      case "yellow": return "bg-yellow-500";
      case "orange": return "bg-orange-500";
      case "red":
      default: return "bg-red-500";
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">ATS Score</h2>
        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getCategoryColor(score.category)}`}>
          {score.total} / 100
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Format Compliance</span>
            <span className="font-medium">{score.breakdown.format.percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${getProgressColor(score.category)}`} style={{ width: `${score.breakdown.format.percentage}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Completeness</span>
            <span className="font-medium">{score.breakdown.completeness.percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${getProgressColor(score.category)}`} style={{ width: `${score.breakdown.completeness.percentage}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Content Quality</span>
            <span className="font-medium">{score.breakdown.quality.percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${getProgressColor(score.category)}`} style={{ width: `${score.breakdown.quality.percentage}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Keyword Match</span>
            <span className="font-medium">{score.breakdown.keywords.percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${getProgressColor(score.category)}`} style={{ width: `${score.breakdown.keywords.percentage}%` }}></div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline mt-1 font-medium bg-transparent border-none p-0 cursor-pointer">
                {jobDescription ? "Edit Job Description" : "+ Paste Job Description"}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Job Description</DialogTitle>
                <DialogDescription>
                  Paste deskripsi lowongan pekerjaan di sini untuk mencocokkan kata kunci (keywords) dengan CV Anda.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <textarea
                  className="w-full min-h-[150px] p-3 text-sm border rounded-md"
                  placeholder="Paste job description..."
                  value={tempJd}
                  onChange={(e) => setTempJd(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveJd}>Analisa Keyword</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {(score.matchedKeywords.length > 0 || score.missingKeywords.length > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Hasil Analisis Keyword:</h3>
          {score.matchedKeywords.length > 0 && (
            <div className="mb-2 text-xs">
              <span className="font-medium text-emerald-700 block mb-1">✅ Terdapat di CV:</span>
              <p className="text-gray-600 leading-relaxed">{score.matchedKeywords.join(", ")}</p>
            </div>
          )}
          {score.missingKeywords.length > 0 && (
            <div className="text-xs">
              <span className="font-medium text-orange-700 block mb-1">⚠️ Belum ada di CV:</span>
              <p className="text-gray-600 leading-relaxed">{score.missingKeywords.slice(0, 10).join(", ")}{score.missingKeywords.length > 10 ? "..." : ""}</p>
            </div>
          )}
        </div>
      )}

      {score.suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Saran Perbaikan:</h3>
          <ul className="space-y-2 text-xs text-gray-600">
            {score.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-orange-500">⚠</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {score.total === 100 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-2 items-center text-xs text-emerald-700 bg-emerald-50 p-2 rounded-md">
            <span>✓</span>
            <span>CV Anda sudah sangat optimal!</span>
          </div>
        </div>
      )}
    </div>
  );
}
