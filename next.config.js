module.exports = {
  webpack(config) {
    if (Array.isArray(config.externals)) {
      config.externals = config.externals.concat(["bufferutil"]);
    } else {
      config.externals = ["bufferutil"];
    }
    return config;
  },
};
