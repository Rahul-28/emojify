# Emoji Data Helper for TypeScript

Enhance your TypeScript projects with seamless emoji integration using this comprehensive helper library. Designed to work alongside [emoji-data](https://github.com/iamcal/emoji-data), it simplifies emoji management and usage within your applications.

## Features

- **Comprehensive Emoji Data**: Access a vast array of emojis with detailed metadata.
- **Skin Tone Variations**: Easily retrieve emojis with specific skin tone modifiers.
- **Efficient Searching**: Quickly find emojis by name or category.
- **Image Data Retrieval**: Obtain precise image positioning data for custom rendering.

## Installation

Install the package via npm:

`npm install @rahul-28/emojify`

## Usage

Import and utilize the EmojiData class in your TypeScript project:

```ts
import { EmojiData } from '@rahul-28/emojify';

const emoji = new EmojiData();

const emojiInfo = emoji.getImageData('smile');
console.log(emojiInfo);
// Output: { x: 53.333333333333336, y: 83.33333333333334, sheetSizeX: 6100, sheetSizeY: 6100, image: '1f604.png'}

console.log(temp.getEmojiByName('heart_eyes'));
// Output: {
//   name: 'SMILING FACE WITH HEART-SHAPED EYES',
//   unified: '1F60D',
//   image: '1f60d.png',
//   sheet_x: 32,
//   sheet_y: 59,
//   short_name: 'heart_eyes',
//   short_names: [ 'heart_eyes' ],
//   category: 'Smileys & Emotion',
//   subcategory: 'face-affection',
//   char: '😍'
// }
```

## Upgrading Emoji Data

To update the underlying emoji dataset to the latest version:
Check and update the following:

- "dependencies": { "emoji-datasource": "^15.1.2"}
  // install latest emoji-dataset
- npm run emoji-build
  // updates the local emoji-dataset
- export const sheetColumns = 61 && export const sheetRows = 61;
  // update the sheet dimensions according to current version

## Issues

If you encouter any issues or bugs please report it [here](https://github.com/Rahul-28/emojify/issues). Feel free to suggest any solutions or work-arounds for others too.
