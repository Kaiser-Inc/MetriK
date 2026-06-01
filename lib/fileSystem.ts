import type { EnrichedItem, ReportLoadError, ReportListResponse } from "@/types/metrics";
import { deriveStack } from "@/types/metrics";
import { migrate } from "@/lib/parseReport";

const STORAGE_KEY = "metrik-reports";

export const hasDirectoryPicker = (): boolean =>
  typeof window !== "undefined" && "showDirectoryPicker" in window;

function enrichFromJson(json: Record<string, unknown>, slug: string): EnrichedItem {
  const report = migrate(json, slug);
  const cc = report.cyclomatic_complexity.summary;
  return {
    slug,
    generated_at: report.generated_at,
    project: report.project,
    stack: deriveStack(report.project),
    cc_grade: cc.grade,
    coverage_percent: report.test_coverage.percent,
    security_passed: report.security.passed,
    rawJson: report,
  };
}

function reasonOf(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export async function parseFilesToItems(files: File[]): Promise<ReportListResponse> {
  const items: EnrichedItem[] = [];
  const errors: ReportLoadError[] = [];
  for (const file of files) {
    if (!file.name.endsWith(".json")) continue;
    try {
      const text = await file.text();
      const json = JSON.parse(text) as Record<string, unknown>;
      const slug = file.name.replace(/\.json$/, "");
      items.push(enrichFromJson(json, slug));
    } catch (e) {
      errors.push({ file: file.name, reason: reasonOf(e) });
    }
  }
  return { items: sortItems(items), errors };
}

export async function parseDirectoryHandle(
  handle: FileSystemDirectoryHandle
): Promise<ReportListResponse> {
  const items: EnrichedItem[] = [];
  const errors: ReportLoadError[] = [];
  for await (const [name, entry] of handle.entries()) {
    if (entry.kind !== "file" || !name.endsWith(".json")) continue;
    try {
      const fileHandle = entry as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      const text = await file.text();
      const json = JSON.parse(text) as Record<string, unknown>;
      const slug = name.replace(/\.json$/, "");
      items.push(enrichFromJson(json, slug));
    } catch (e) {
      errors.push({ file: name, reason: reasonOf(e) });
    }
  }
  return { items: sortItems(items), errors };
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
  // HHMMSS (6-digit: Python/Ruby)
  const m6 = value.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})(\d{2})$/);
  if (m6) return new Date(`${m6[1]}T${m6[2]}:${m6[3]}:${m6[4]}`);
  // HHMM (4-digit: Node/Next/Expo)
  const m4 = value.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})$/);
  if (m4) return new Date(`${m4[1]}T${m4[2]}:${m4[3]}:00`);
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
