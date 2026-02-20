import type { ZodType } from "zod";

type AutoSaveResult = "saved" | "unauthorized" | "error";

/**
 * Creates the standard PATCH-based save callback used by every form's useAutoSave.
 * Returns "unauthorized" on 401, "saved" on success, "error" otherwise.
 */
export function createAutoSaveFetcher(
  url: string,
): (payload: unknown) => Promise<AutoSaveResult> {
  return async function save(payload: unknown): Promise<AutoSaveResult> {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      return "unauthorized";
    }

    return response.ok ? "saved" : "error";
  };
}

/**
 * Creates a parseDraft / toPayload callback that validates data through a Zod schema.
 * Returns the parsed data on success, null on failure.
 */
export function createSchemaValidator<T>(
  schema: ZodType<T>,
): (data: unknown) => T | null {
  return function validate(data: unknown): T | null {
    const result = schema.safeParse(data);
    return result.success ? result.data : null;
  };
}
