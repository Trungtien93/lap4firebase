const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs'); // Thêm hỗ trợ .cjs
defaultConfig.resolver.unstable_enablePackageExports = false; // 👈 Dòng fix lỗi auth crash Hermes
<<<<<<< HEAD
=======

>>>>>>> e193fd014d97d193c2fc82c6f98513d705ce651c
module.exports = defaultConfig;
