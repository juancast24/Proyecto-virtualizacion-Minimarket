// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Agrega 'cjs' a las extensiones de origen
config.resolver.sourceExts.push('cjs');

// Deshabilita unstable_enablePackageExports en el objeto 'resolver'
config.resolver.unstable_enablePackageExports = false;

module.exports = config;