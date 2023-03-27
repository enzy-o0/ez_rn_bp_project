const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/components/**/**/*.stories.tsx'],
  features: {
    interactionsDebugger: true,
  },
  webpackFinal: config => {
    config.plugins.push(
      // Removing Speedy so the static storybook styling doesn't break
      new webpack.DefinePlugin({
        SC_DISABLE_SPEEDY: true,
      }),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    );

    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../'),
      path.resolve(__dirname, 'src/components'),
    ];
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
      '@storybook/react-native': '@storybook/react', // 별명 대체
    };

    config.resolve.extensions = ['.tsx', '.ts', '.web.js', '.js'];

    // mutate babel-loader
    config.module.rules[0].use[0].options.plugins.push([
      'react-native-web',
      {commonjs: true},
    ]);
    // config.module.rules.push({
    //   test: /\.(ts|tsx)$/,
    //   use: [
    //     {
    //       loader: require.resolve('awesome-typescript-loader'),
    //     },
    //   ],
    // });

    return config;
  },
  babel: options => {
    options.plugins.push('babel-plugin-inline-react-svg');
    return options;
  },
};
