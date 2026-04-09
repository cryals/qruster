module.exports = function (context, options) {
  return {
    name: 'disable-webpackbar',
    configureWebpack(config, isServer, utils) {
      return {
        plugins: [
          ...config.plugins.filter(
            (plugin) => plugin.constructor.name !== 'WebpackBar'
          ),
        ],
      };
    },
  };
};
