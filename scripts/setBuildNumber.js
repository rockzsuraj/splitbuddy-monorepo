#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ---------- Resolve repo root ----------
const ROOT = path.resolve(__dirname, '..');

// ---------- Load version config ----------
const {
  APP_VERSION,
  IOS_BUILD_VERSION,
  ADR_BUILD_VERSION,
} = require(path.join(
  ROOT,
  'apps/mobile/src/config/version.config.js'
));

/* ===================== iOS ===================== */

const IOS_PLIST = path.join(
  ROOT,
  'apps/mobile/ios/SplitBuddy/Info.plist'
);

if (fs.existsSync(IOS_PLIST)) {
  let plist = fs.readFileSync(IOS_PLIST, 'utf8');

  // Update version (CFBundleShortVersionString)
  plist = plist.replace(
    /<key>CFBundleShortVersionString<\/key>\s*<string>.*?<\/string>/,
    `<key>CFBundleShortVersionString</key>\n\t<string>${APP_VERSION}</string>`
  );

  // Update build number (CFBundleVersion)
  plist = plist.replace(
    /<key>CFBundleVersion<\/key>\s*<string>.*?<\/string>/,
    `<key>CFBundleVersion</key>\n\t<string>${IOS_BUILD_VERSION}</string>`
  );

  fs.writeFileSync(IOS_PLIST, plist);
  console.log(
    `✅ iOS → version ${APP_VERSION} (${IOS_BUILD_VERSION})`
  );
} else {
  console.warn('⚠️ iOS Info.plist not found, skipping');
}

/* ===================== Android ===================== */

const ANDROID_GRADLE = path.join(
  ROOT,
  'apps/mobile/android/app/build.gradle'
);

if (fs.existsSync(ANDROID_GRADLE)) {
  let gradle = fs.readFileSync(ANDROID_GRADLE, 'utf8');

  // versionName
  gradle = gradle.replace(
    /versionName\s+".*?"/,
    `versionName "${APP_VERSION}"`
  );

  // versionCode
  gradle = gradle.replace(
    /versionCode\s+\d+/,
    `versionCode ${ADR_BUILD_VERSION}`
  );

  fs.writeFileSync(ANDROID_GRADLE, gradle);
  console.log(
    `✅ Android → version ${APP_VERSION} (${ADR_BUILD_VERSION})`
  );
} else {
  console.warn('⚠️ Android build.gradle not found, skipping');
}