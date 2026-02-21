"use client";

import { useEffect, useRef, useState } from "react";
import { type Control, type FieldValues, type UseFormReset, useWatch } from "react-hook-form";

export const AUTO_SAVE_DEBOUNCE_MS = 30_000;

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

type UseAutoSaveParams<TValues extends FieldValues, TPayload> = {
  control: Control<TValues>;
  reset: UseFormReset<TValues>;
  storageKey: string;
  parseDraft: (draft: unknown) => TValues | null;
  toPayload: (values: TValues) => TPayload | null;
  save: (payload: TPayload) => Promise<"saved" | "unauthorized" | "error">;
  onUnauthorized: () => void;
  debounceMs?: number;
  onDraftChange?: (values: TValues) => void;
};

type UseAutoSaveResult = {
  status: AutoSaveStatus;
  lastSavedAt: string;
};

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export function useAutoSave<TValues extends FieldValues, TPayload>({
  control,
  reset,
  storageKey,
  parseDraft,
  toPayload,
  save,
  onUnauthorized,
  debounceMs = AUTO_SAVE_DEBOUNCE_MS,
  onDraftChange,
}: UseAutoSaveParams<TValues, TPayload>): UseAutoSaveResult {
  const values = useWatch({ control }) as TValues | undefined;
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const hasHydratedRef = useRef(false);
  const lastSerializedRef = useRef<string | null>(null);

  const parseDraftRef = useRef(parseDraft);
  const toPayloadRef = useRef(toPayload);
  const saveRef = useRef(save);
  const onUnauthorizedRef = useRef(onUnauthorized);
  const onDraftChangeRef = useRef(onDraftChange);

  useEffect(() => { parseDraftRef.current = parseDraft; }, [parseDraft]);
  useEffect(() => { toPayloadRef.current = toPayload; }, [toPayload]);
  useEffect(() => { saveRef.current = save; }, [save]);
  useEffect(() => { onUnauthorizedRef.current = onUnauthorized; }, [onUnauthorized]);
  useEffect(() => { onDraftChangeRef.current = onDraftChange; }, [onDraftChange]);

  // Load from local storage
  useEffect(() => {
    if (hasHydratedRef.current) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        hasHydratedRef.current = true;
        return;
      }
      const parsed = parseDraftRef.current(JSON.parse(raw));
      if (!parsed) {
        hasHydratedRef.current = true;
        return;
      }
      reset(parsed);
      lastSerializedRef.current = JSON.stringify(parsed);
    } catch {
      // ignore
    } finally {
      hasHydratedRef.current = true;
    }
  }, [reset, storageKey]);

  // Debounce for live preview
  useEffect(() => {
    if (!hasHydratedRef.current || !values) return;
    const timeoutId = window.setTimeout(() => {
      onDraftChangeRef.current?.(values);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [values]);

  // Save to local storage and API
  useEffect(() => {
    if (!hasHydratedRef.current || !values) return;

    const serialized = JSON.stringify(values);

    if (lastSerializedRef.current === null) {
      lastSerializedRef.current = serialized;
      return;
    }

    if (serialized === lastSerializedRef.current) return;

    try {
      window.localStorage.setItem(storageKey, serialized);
    } catch {
      // ignore
    }

    const payload = toPayloadRef.current(values);
    if (!payload) return;

    const timeoutId = window.setTimeout(async () => {
      setStatus("saving");
      const result = await saveRef.current(payload);

      if (result === "unauthorized") {
        onUnauthorizedRef.current();
        return;
      }

      if (result === "saved") {
        setStatus("saved");
        setLastSavedAt(formatTime(new Date()));
        lastSerializedRef.current = serialized;
        return;
      }

      setStatus("error");
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [debounceMs, storageKey, values]);

  return { status, lastSavedAt };
}
