const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checks = [
  'package.json',
  'README.md',
  'src/pages/api/health.ts',
  'src/pages/index.tsx',
  'prisma/schema.prisma',
  'docs/API.md'
];

let ok = true;
for (const rel of checks) {
  const p = path.join(root, rel);
  const exists = fs.existsSync(p);
  console.log(`${rel}: ${exists ? 'FOUND' : 'MISSING'}`);
  ok = ok && exists;
}

if (!ok) {
  console.error('Smoke test failed: some files missing');
  process.exit(2);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
if (!pkg.scripts || !pkg.scripts.test) {
  console.error('Smoke test failed: package.json missing test script');
  process.exit(2);
}

console.log('Smoke test passed');
process.exit(0);
