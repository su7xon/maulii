const path = require('path');
const fs = require('fs');
const core = require('C:/Users/Admin/AppData/Roaming/npm/node_modules/@bubblewrap/cli/node_modules/@bubblewrap/core');

async function main() {
  const log = new core.ConsoleLog('BuildTWA');
  const targetDir = path.resolve(__dirname, 'android_app');
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log('Loading twa-manifest.json...');
  const manifest = await core.TwaManifest.fromFile(path.resolve(__dirname, 'twa-manifest.json'));
  console.log('Manifest loaded:', manifest.packageId, manifest.host);

  const generator = new core.TwaGenerator();
  console.log('Generating TWA Android project in:', targetDir);
  await generator.createTwaProject(targetDir, manifest, log, (step, total, msg) => {
    console.log(`[${step}/${total}] ${msg || ''}`);
  });
  console.log('TWA Android Project successfully created!');
}

main().catch(console.error);

