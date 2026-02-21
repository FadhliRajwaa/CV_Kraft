import type { CvData } from "./default-data";

export type AtsScoreCategory = "red" | "orange" | "yellow" | "green";

export type AtsScoreDetails = {
  total: number;
  category: AtsScoreCategory;
  suggestions: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  breakdown: {
    format: { score: number; max: number; percentage: number };
    completeness: { score: number; max: number; percentage: number };
    keywords: { score: number; max: number; percentage: number };
    quality: { score: number; max: number; percentage: number };
  };
};

function extractKeywords(text: string): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
  const stopWords = new Set([
    'the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not',
    'dan', 'di', 'yang', 'untuk', 'dengan', 'dari', 'ini', 'ke', 'pada', 'juga', 'dalam', 'akan', 'bisa', 'ada', 'itu', 'atau', 'sebagai', 'tidak', 'oleh', 'saat', 'sudah'
  ]);

  const keywords = new Set<string>();
  for (const word of words) {
    if (word.length > 2 && !stopWords.has(word)) {
      keywords.add(word);
    }
  }
  return keywords;
}

export function calculateAtsScore(data: CvData, jobDescription?: string): AtsScoreDetails {
  // Format Compliance (30%) - Always 100% since we enforce clean templates
  const formatScore = 30;

  const suggestions: string[] = [];

  // Section Completeness (25%)
  // Needs: personal info (name, email, phone), summary, 1+ experience, 1+ education, 1+ skills
  let completenessScore = 0;
  if (data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone) {
    completenessScore += 5;
  } else {
    suggestions.push("Lengkapi informasi kontak (Nama, Email, dan Telepon).");
  }

  if (data.summary && data.summary.length > 50) {
    completenessScore += 5;
  } else {
    suggestions.push("Tambahkan ringkasan profesional yang kuat (minimal 50 karakter).");
  }

  if (data.experiences && data.experiences.length > 0) {
    completenessScore += 5;
  } else {
    suggestions.push("Tambahkan setidaknya satu pengalaman kerja.");
  }

  if (data.educations && data.educations.length > 0) {
    completenessScore += 5;
  } else {
    suggestions.push("Tambahkan riwayat pendidikan.");
  }

  if (data.skills && data.skills.length > 0) {
    completenessScore += 5;
  } else {
    suggestions.push("Tambahkan bagian keahlian (skills) untuk keyword dasar.");
  }

  // Keyword Match (25%)
  let keywordsScore = 0;
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  if (jobDescription && jobDescription.trim().length > 0) {
    const jdKeywords = extractKeywords(jobDescription);

    // Extract CV text
    let cvText = data.summary + " ";
    for (const exp of data.experiences || []) {
      cvText += exp.position + " " + exp.company + " " + exp.description + " " + exp.achievements.join(" ") + " ";
    }
    for (const skill of data.skills || []) {
      cvText += skill.name + " ";
    }
    for (const proj of data.projects || []) {
      cvText += proj.name + " " + proj.description + " " + proj.technologies.join(" ") + " ";
    }
    for (const cert of data.certifications || []) {
      cvText += cert.name + " ";
    }
    for (const edu of data.educations || []) {
      cvText += edu.fieldOfStudy + " " + edu.degree + " ";
    }

    const cvKeywords = extractKeywords(cvText);

    let matchCount = 0;
    for (const word of jdKeywords) {
      if (cvKeywords.has(word)) {
        matchedKeywords.push(word);
        matchCount++;
      } else {
        missingKeywords.push(word);
      }
    }

    const keywordPercentage = jdKeywords.size > 0 ? matchCount / jdKeywords.size : 0;
    keywordsScore = Math.min(25, Math.round(keywordPercentage * 25));

    if (missingKeywords.length > 0) {
      suggestions.push(`Tambahkan keyword penting dari lowongan: ${missingKeywords.slice(0, 3).join(", ")}`);
    }
  } else {
    suggestions.push("Masukkan Job Description untuk menganalisa kecocokan keyword.");
  }

  // Content Quality (20%)
  // Heuristics: experiences have achievements (bullet points), summary length
  let qualityScore = 0;
  if (data.summary && data.summary.length > 150) {
    qualityScore += 5;
  } else if (data.summary && data.summary.length > 0) {
    suggestions.push("Perpanjang ringkasan profesional Anda (> 150 karakter) untuk daya tarik lebih baik.");
  }

  const totalAchievements = (data.experiences || []).reduce((acc: number, exp: { achievements?: string[] }) => acc + (exp.achievements?.length || 0), 0);
  if (totalAchievements > 0) {
    qualityScore += 5;
  } else if (data.experiences && data.experiences.length > 0) {
    suggestions.push("Tambahkan setidaknya satu pencapaian (bullet point) pada pengalaman kerja.");
  }

  if (totalAchievements >= 3) {
    qualityScore += 5; // Good amount of bullets
  } else if (totalAchievements > 0) {
    suggestions.push("Gunakan lebih banyak bullet points pada deskripsi pengalaman (direkomendasikan minimal 3).");
  }

  if (data.skills && data.skills.length >= 5) {
    qualityScore += 5;
  } else if (data.skills && data.skills.length > 0) {
    suggestions.push("Sebaiknya sertakan minimal 5 keahlian utama di CV Anda.");
  }

  const total = formatScore + completenessScore + keywordsScore + qualityScore;

  let category: AtsScoreCategory = "red";
  if (total > 80) category = "green";
  else if (total > 60) category = "yellow";
  else if (total > 40) category = "orange";

  return {
    total,
    category,
    suggestions,
    matchedKeywords,
    missingKeywords,
    breakdown: {
      format: { score: formatScore, max: 30, percentage: Math.round((formatScore / 30) * 100) },
      completeness: { score: completenessScore, max: 25, percentage: Math.round((completenessScore / 25) * 100) },
      keywords: { score: keywordsScore, max: 25, percentage: Math.round((keywordsScore / 25) * 100) },
      quality: { score: qualityScore, max: 20, percentage: Math.round((qualityScore / 20) * 100) },
    },
  };
}
