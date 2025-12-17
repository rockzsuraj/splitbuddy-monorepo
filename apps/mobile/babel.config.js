module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],

    'react-native-worklets/plugin',

    // IMPORTANT:
    // If you enable reanimated later, it MUST stay LAST
    // 'react-native-reanimated/plugin',
  ],
};