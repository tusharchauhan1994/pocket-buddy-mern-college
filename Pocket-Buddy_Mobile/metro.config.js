// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Reduce worker count to avoid permission issues on Windows
config.transformer = {
  ...config.transformer,
  workerCount: 1,
};

module.exports = config;
