/**
 * Cria stubs de PNG para @kaiserinc/assets após pnpm install.
 *
 * @kaiserinc/react usa new URL("../../assets/logo-*.png", import.meta.url)
 * que resolve para node_modules/@kaiserinc/assets/ (e o virtual store do pnpm).
 * O pacote @kaiserinc/assets não está publicado no registry — este script
 * cria os stubs 1×1 px necessários para o Turbopack resolver os módulos.
 */
import { mkdirSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL("..", import.meta.url));

// 1×1 px PNG transparente (67 bytes)
const STUB_PNG = Buffer.from(
  "89504e470d0a1a0a0000000d4948445200000001000000010802000000907753" +
  "de0000000c49444154789c63f80f00000101000518d84e0000000049454e44ae426082",
  "hex"
);

const LOGOS = [
  "logo-kaiser-transparent.png",
  "logo-kaiser-light.png",
  "logo-kaiser-square.png",
];

function createStubs(dir) {
  mkdirSync(dir, { recursive: true });
  for (const name of LOGOS) {
    const dest = join(dir, name);
    if (!existsSync(dest)) {
      writeFileSync(dest, STUB_PNG);
    }
  }
}

try {
  // 1. Hoisted path (node_modules/@kaiserinc/assets)
  createStubs(join(root, "node_modules/@kaiserinc/assets"));

  // 2. pnpm virtual store — cada entrada @kaiserinc+react@* precisa do sibling
  const pnpmDir = join(root, "node_modules/.pnpm");
  if (existsSync(pnpmDir)) {
    const entries = readdirSync(pnpmDir).filter((e) =>
      e.startsWith("@kaiserinc+react@")
    );
    for (const entry of entries) {
      const assetsDir = join(pnpmDir, entry, "node_modules/@kaiserinc/assets");
      createStubs(assetsDir);
    }
  }

  console.log("✓ @kaiserinc/assets stubs criados");
} catch (err) {
  // Never fail `pnpm install` (e.g. read-only/odd layouts inside containers):
  // the build step recreates what it needs and Turbopack tolerates missing stubs.
  console.warn("⚠ postinstall: não foi possível criar stubs @kaiserinc/assets:", err?.message ?? err);
}
