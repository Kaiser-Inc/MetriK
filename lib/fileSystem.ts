import type { EnrichedItem, MetricsReport } from "@/types/metrics";
import { deriveStack } from "@/types/metrics";

const STORAGE_KEY = "metrik-reports";

export const hasDirectoryPicker = (): boolean =>
  typeof window !== "undefined" && "showDirectoryPicker" in window;

function enrichFromJson(json: Record<string, unknown>, slug: string): EnrichedItem {
  const cc = (json.cyclomatic_complexity as Record<string, unknown> | undefined)
    ?.summary as Record<string, unknown> | undefined;
  const project = (json.project as string) ?? slug;
  return {
    slug,
    generated_at: (json.generated_at as string) ?? "",
    project,
    stack: deriveStack(project),
    cc_grade: cc?.grade as string | undefined,
    coverage_percent: (json.test_coverage as Record<string, unknown> | undefined)
      ?.percent as number | undefined,
    xenon_passed: (json.xenon as Record<string, unknown> | undefined)
      ?.passed as boolean | undefined,
    rawJson: json as MetricsReport,
  };
}

export async function parseFilesToItems(files: File[]): Promise<EnrichedItem[]> {
  const items: EnrichedItem[] = [];
  for (const file of files) {
    if (!file.name.endsWith(".json")) continue;
    try {
      const text = await file.text();
      const json = JSON.parse(text) as Record<string, unknown>;
      const slug = file.name.replace(/\.json$/, "");
      items.push(enrichFromJson(json, slug));
    } catch {
    }
  }
  return sortItems(items);
}

export async function parseDirectoryHandle(
  handle: FileSystemDirectoryHandle
): Promise<EnrichedItem[]> {
  const items: EnrichedItem[] = [];
  for await (const [name, entry] of handle.entries()) {
    if (entry.kind !== "file" || !name.endsWith(".json")) continue;
    try {
      const fileHandle = entry as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      const text = await file.text();
      const json = JSON.parse(text) as Record<string, unknown>;
      const slug = name.replace(/\.json$/, "");
      items.push(enrichFromJson(json, slug));
    } catch {
    }
  }
  return sortItems(items);
}

function sortItems(items: EnrichedItem[]): EnrichedItem[] {
  return items.sort((a, b) => {
    const da = parseDate(a.generated_at);
    const db = parseDate(b.generated_at);
    return db.getTime() - da.getTime();
  });
}

function parseDate(value: string): Date {
  if (!value) return new Date(0);
  const m = value.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})(\d{2})$/);
  if (m) return new Date(`${m[1]}T${m[2]}:${m[3]}:${m[4]}`);
  return new Date(value);
}

export function saveReportsToSession(items: EnrichedItem[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
  }
}

export function loadReportsFromSession(): EnrichedItem[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EnrichedItem[];
  } catch {
    return null;
  }
}

export function clearReportsFromSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
