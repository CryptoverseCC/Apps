module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('awesome-typescript-loader')
  });
  defaultConfig.resolve.extensions.push('.ts', '.tsx');
  return defaultConfig;
};