"use client";

import { useRouter } from "next/navigation";

type LanguageSelectorProps = {
  cvId: string;
  value: "id" | "en";
};

export function LanguageSelector({ cvId, value }: LanguageSelectorProps) {
  const router = useRouter();

  async function handleChange(nextLanguage: "id" | "en"): Promise<void> {
    const response = await fetch(`/api/cv/${cvId}/language`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: nextLanguage }),
    });

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-1">
      <label htmlFor="cv-language" className="text-sm font-medium text-gray-700">
        Bahasa Output
      </label>
      <select
        id="cv-language"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        value={value}
        onChange={(event) => void handleChange(event.target.value as "id" | "en")}
      >
        <option value="id">Bahasa Indonesia</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
