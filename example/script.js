import * as emoji from 'emojify';

const temp = new emoji.EmojiData();

const str = 'I heart Pizza';

const splitted = str.split(' ');
splitted.forEach((part) => {
  const emojiIm = temp.getEmojiByName(part);
  if (emojiIm && emojiIm.char !== undefined) {
    console.log(emojiIm.char);
  } else {
    console.log(part);
  }
});
// Output:
// I
// ❤️
// 🍕

console.log(temp.getImageData('smile'));
// Output: {
// {
//     x: 53.333333333333336,
//     y: 83.33333333333334,
//     sheetSizeX: 6100,
//     sheetSizeY: 6100,
//     image: '1f604.png'
//   }

console.log(temp.getEmojiByName('heart_eyes'));
// Output: {
//     name: 'SMILING FACE WITH HEART-SHAPED EYES',
//     unified: '1F60D',
//     image: '1f60d.png',
//     sheet_x: 32,
//     sheet_y: 59,
//     short_name: 'heart_eyes',
//     short_names: [ 'heart_eyes' ],
//     category: 'Smileys & Emotion',
//     subcategory: 'face-affection',
//     char: '😍'
//   }

console.log(temp.getImageDataWithColon(':smile:'));
// Output: {
//  x: 53.333333333333336,
//  y: 83.33333333333334,
//  sheetSizeX: 6100,
//  sheetSizeY: 6100,
//  image: '1f604.png'
// }
