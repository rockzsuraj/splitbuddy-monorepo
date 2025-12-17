const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const monorepoRoot = path.resolve(__dirname, '../..');

const defaultConfig = getDefaultConfig(projectRoot);

const config = {
  // Let Metro follow symlinks into the monorepo root
  watchFolders: [monorepoRoot],

  resolver: {
    ...defaultConfig.resolver,
    // Tell Metro exactly where node_modules live (local + root)
    nodeModulesPaths: [
      path.join(projectRoot, 'node_modules'),
      path.join(monorepoRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
