module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '#apis': './src/apis',
          '#assets': './src/assets',
          '#components': './src/components',
          '#constants': './src/constants',
          '#containers': './src/containers',
          '#hooks': './src/hooks',
          '#navigation': './src/navigation',
          '#recoil': './src/recoil',
          '#services': './src/services',
          '#types': './src/types',
          '#utils': './src/utils',
        },
      },
    ],
  ],
};
