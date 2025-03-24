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
console.log();
console.log(temp.getImageData('smile'));
console.log(temp.getEmojiByName('heart_eyes'));
console.log(temp.getImageDataWithColon(':smile:'));
