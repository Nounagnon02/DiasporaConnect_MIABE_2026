const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  https: require.resolve('https-browserify'),
  url: require.resolve('url'),
  vm: require.resolve('vm-browserify'),
};

module.exports = config;
