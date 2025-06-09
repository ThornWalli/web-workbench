// scripts/copy-coi-worker.mjs
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pkgName = 'coi-serviceworker';
const relativeFilePathInPackage = 'coi-serviceworker.min.js';

const destDir = path.resolve(
  path.dirname(import.meta.url.replace('file://', '')),
  '..',
  'src/public'
);

const destinationFileName = 'coi-serviceworker.min.js';

try {
  const packageJsonPath = require.resolve(path.join(pkgName, 'package.json'));
  const packageRoot = path.dirname(packageJsonPath);

  const src = path.join(packageRoot, relativeFilePathInPackage);
  const dest = path.join(destDir, destinationFileName);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
} catch (error) {
  console.error(error);
  process.exit(1);
}
