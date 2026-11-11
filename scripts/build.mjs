import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { packageCss } from './package.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const cliManifest = new URL(import.meta.resolve('@tailwindcss/cli/package.json'));
const { bin } = JSON.parse(await readFile(cliManifest, 'utf8'));
const cliPath = fileURLToPath(new URL(bin.tailwindcss, cliManifest));

export async function build({ signal } = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      cliPath,
      '--input', 'src/theme.css',
      '--output', 'dist/cursorbrains.css',
      '--minify',
    ], { cwd: root, stdio: 'inherit', signal });

    child.once('error', reject);
    child.once('exit', (code, exitSignal) => {
      if (code === 0) resolve();
      else reject(new Error(`Tailwind build failed (${exitSignal ?? code}).`));
    });
  });

  signal?.throwIfAborted();
  await packageCss();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await build();
}
