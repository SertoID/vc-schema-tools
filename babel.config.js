// Needed for jest tests to work with typescript.
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        loose: true,
        modules: "commonjs",
      }
    ],
    '@babel/preset-typescript',
  ],
};
