import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { migrate } from "@/lib/parseReport";
import { deriveStack } from "@/types/metrics";

const dir = join(process.cwd(), "e2e", "fixtures");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

describe("e2e fixtures", () => {
  it("cover the three supported stacks", () => {
    const stacks = files.map((f) => {
      const raw = JSON.parse(readFileSync(join(dir, f), "utf-8"));
      return deriveStack(migrate(raw, f).project);
    });
    expect(stacks.sort()).toEqual(["node-fastify", "python-fastapi", "ruby-on-rails"]);
  });
});
