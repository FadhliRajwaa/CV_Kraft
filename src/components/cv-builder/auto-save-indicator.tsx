import type { AutoSaveStatus } from "@/hooks/use-auto-save";

type AutoSaveIndicatorProps = {
  status: AutoSaveStatus;
  lastSavedAt: string;
};

export function AutoSaveIndicator({ status, lastSavedAt }: AutoSaveIndicatorProps) {
  if (status === "saving") {
    return <p className="text-xs text-gray-500">Menyimpan otomatis...</p>;
  }

  if (status === "saved") {
    return <p className="text-xs text-green-700">Tersimpan ✓ {lastSavedAt}</p>;
  }

  if (status === "error") {
    return <p className="text-xs text-red-600">Auto-save gagal, coba simpan manual.</p>;
  }

  return <p className="text-xs text-gray-500">Auto-save aktif (idle 30 detik).</p>;
}
