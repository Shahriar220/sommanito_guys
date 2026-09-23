const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const extDir = path.resolve(__dirname, 'vscode-syntax-error-sound');
const buildDir = path.resolve(__dirname, 'build-vsix-tmp');
const outputFile = path.resolve(extDir, 'syntax-error-sound-1.0.0.vsix');

if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir, { recursive: true });

// 1. [Content_Types].xml
const contentTypesXml = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="js" ContentType="application/javascript" />
  <Default Extension="md" ContentType="text/markdown" />
  <Default Extension="mp3" ContentType="audio/mpeg" />
  <Default Extension="wav" ContentType="audio/wav" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
  <Default Extension="xml" ContentType="text/xml" />
</Types>`;
fs.writeFileSync(path.join(buildDir, '[Content_Types].xml'), contentTypesXml, 'utf8');

// 2. extension.vsixmanifest
const vsixManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Id="syntax-error-sound" Version="1.0.0" Language="en-US" Publisher="local-developer" />
    <DisplayName>Syntax Error Sound</DisplayName>
    <Description xml:space="preserve">Plays your custom sound whenever a syntax error occurs while coding.</Description>
    <Categories>Other</Categories>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
    <Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" />
  </Assets>
</PackageManifest>`;
fs.writeFileSync(path.join(buildDir, 'extension.vsixmanifest'), vsixManifestXml, 'utf8');

// 3. Copy files into extension/
const targetExtDir = path.join(buildDir, 'extension');
fs.mkdirSync(targetExtDir, { recursive: true });

function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const item of fs.readdirSync(src)) {
            copyRecursive(path.join(src, item), path.join(dest, item));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

copyRecursive(path.join(extDir, 'package.json'), path.join(targetExtDir, 'package.json'));
copyRecursive(path.join(extDir, 'extension.js'), path.join(targetExtDir, 'extension.js'));
copyRecursive(path.join(extDir, 'README.md'), path.join(targetExtDir, 'README.md'));
copyRecursive(path.join(extDir, 'sounds'), path.join(targetExtDir, 'sounds'));

// 4. Zip build directory into .vsix
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
}

execSync(`cd "${buildDir}" && /usr/bin/zip -q -r "${outputFile}" .`);
fs.rmSync(buildDir, { recursive: true, force: true });

console.log('Successfully created VSIX package at:', outputFile);
