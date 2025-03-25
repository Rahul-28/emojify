import emojiData from '../lib/data-source/emoji.json';
import { type IEmoji } from '../lib/data-source/emoji-data.models';
import { sheetColumns, sheetRows } from '../lib/data-source/index';
import { EmojiData } from '../lib/data-source/index';
import { describe, test, expect } from 'vitest';
import { multiplyPos } from './util';

/**
 * Test Suite for Emoji Data API.
 *
 * This suite verifies the core functionality of the EmojiData class,
 * including instance creation, version checking, data retrieval, image data processing,
 * skin tone handling, emoji search, and conversion of emojis to their short-name strings.
 */
describe('Emoji Data API', () => {
  // Create an instance of the EmojiData class to be used in all tests.
  const emojiDataInstance = new EmojiData();

  /**
   * Test to ensure that emojiDataInstance is an instance of EmojiData.
   */
  test('Check Instance', () => {
    expect(emojiDataInstance).toBeInstanceOf(EmojiData);
  });

  /**
   * Test to verify that getVariationEmojis returns all emojis that have skin variations.
   */
  test('Should return array with various skin tones', () => {
    const expectedVariationEmojis = emojiData.filter(
      (eachEmoji) => eachEmoji.skin_variations != null,
    );
    expect(emojiDataInstance.getVariationEmojis()).toEqual(
      expectedVariationEmojis,
    );
  });

  /**
   * Test to verify that getImageDataWithColon returns correct image data
   * for an emoji represented with colon-wrapped short name.
   */
  test('getImageDataWithColon returns correct data', () => {
    const shortName = 'smile';
    const smileData = emojiDataInstance.getEmojiByName(shortName);
    if (smileData == null) {
      throw new Error('smile emoji not found');
    }

    const expectedImageData = {
      image: '1f604.png',
      sheetSizeX: sheetColumns * 100,
      sheetSizeY: sheetRows * 100,
      ...multiplyPos(
        smileData.sheet_x,
        smileData.sheet_y,
        sheetColumns,
        sheetRows,
      ),
    };

    expect(emojiDataInstance.getImageDataWithColon(`:${shortName}:`)).toEqual(
      expectedImageData,
    );
  });

  /**
   * Test to verify that getImageData returns correct image data
   * for an emoji identified by its short name.
   */
  test('getImageData returns correct data', () => {
    const shortName = 'smile';
    const smileData = emojiDataInstance.getEmojiByName(shortName);
    if (smileData == null) {
      throw new Error('smile emoji not found');
    }

    const expectedImageData = {
      image: '1f604.png',
      sheetSizeX: sheetColumns * 100,
      sheetSizeY: sheetRows * 100,
      ...multiplyPos(
        smileData.sheet_x,
        smileData.sheet_y,
        sheetColumns,
        sheetRows,
      ),
    };

    expect(emojiDataInstance.getImageData(shortName)).toEqual(
      expectedImageData,
    );
  });

  /**
   * Test to verify that getImageData returns correct image data
   * for an emoji identified by its short name.
   * even is the Name is in upper case
   */
  test('getImageData returns correct data for Upper Case String', () => {
    const shortUpperCaseName = 'SMILE';
    const smileData = emojiDataInstance.getEmojiByName(shortUpperCaseName);
    console.log(smileData);
    if (smileData == null) {
      throw new Error('smile emoji not found');
    }

    const expectedImageData = {
      image: '1f604.png',
      sheetSizeX: sheetColumns * 100,
      sheetSizeY: sheetRows * 100,
      ...multiplyPos(
        smileData.sheet_x,
        smileData.sheet_y,
        sheetColumns,
        sheetRows,
      ),
    };

    expect(emojiDataInstance.getImageData(shortUpperCaseName)).toEqual(
      expectedImageData,
    );
  });

  /**
   * Test to verify that getImageData returns correct image data
   * when an emoji with a skin tone is specified.
   */
  test('getImageData returns correct data with skintone', () => {
    const shortName = 'spock-hand';
    const skinTone = 'skin-tone-4';
    const spockHand = emojiDataInstance.getEmojiByName(shortName);
    const skin4 = emojiDataInstance.getEmojiByName(skinTone);

    if (!spockHand || !skin4 || spockHand.skin_variations == null) {
      throw new Error('Emoji or skin tone not found');
    }
    // Look up the skin variation using the unified code of the skin tone modifier.
    const spockHandSkin4 = spockHand.skin_variations[skin4.unified];
    if (!spockHandSkin4) {
      throw new Error('Emoji with skintone not found');
    }

    const expectedData = {
      image: '1f596-1f3fd.png',
      sheetSizeX: sheetColumns * 100,
      sheetSizeY: sheetRows * 100,
      ...multiplyPos(
        spockHandSkin4.sheet_x,
        spockHandSkin4.sheet_y,
        sheetColumns,
        sheetRows,
      ),
    };

    expect(emojiDataInstance.getImageData(`${shortName}::${skinTone}`)).toEqual(
      expectedData,
    );
  });

  /**
   * Test to verify that getImageData returns null for an invalid emoji input.
   */
  test('getImageData returns null with invalid emoji', () => {
    expect(emojiDataInstance.getImageData(':)')).toEqual(null);
  });

  /**
   * Test to verify that getImageData returns null for an invalid emoji input with a skin tone modifier.
   */
  test('getImageData returns null with invalid emoji with skintone', () => {
    expect(emojiDataInstance.getImageData(':)::skin-tone-4')).toEqual(null);
  });

  /**
   * Test to verify that getEmojiByName returns the correct emoji object based on short name.
   */
  test('getEmojiByName returns correct emoji object', () => {
    const shortName = 'smile';
    const expectedEmoji = emojiData.find((a) => a.short_name === shortName);
    expect(emojiDataInstance.getEmojiByName(shortName)).toEqual(expectedEmoji);
  });

  /**
   * Test to verify that searchEmoji returns the correct list of emojis
   * matching a given search substring.
   */
  test('searchEmoji returns correct emoji list', () => {
    const searchWord = 's';
    const resultShortNames = emojiDataInstance
      .searchEmoji(searchWord, 10)
      .map((a) => a.short_name);
    const expectedShortNames = [
      'sa',
      'sob',
      'ski',
      'six',
      'sos',
      'swan',
      'seal',
      'stew',
      'salt',
      'sake',
    ];
    expect(resultShortNames).toEqual(expectedShortNames);
  });

  /**
   * Test to check that hasSkinTone returns true when the emoji string contains a skin tone.
   */
  test(':ok_hand::skin-tone-5: is judged true', () => {
    expect(emojiDataInstance.hasSkinTone(':ok_hand::skin-tone-5:')).toEqual(
      true,
    );
  });

  /**
   * Test to check that hasSkinTone returns false when the emoji string does not contain a skin tone.
   */
  test(':ok_hand: is judged false', () => {
    expect(emojiDataInstance.hasSkinTone(':ok_hand:')).toEqual(false);
  });

  /**
   * Test to verify that replaceEmojiToStr correctly converts an emoji without a skin tone to its colon-wrapped short name.
   */
  test('replaceEmojiToStr returns emoji short name with no skintone', () => {
    expect(emojiDataInstance.replaceEmojiToStr('😀')).toEqual(':grinning:');
  });

  /**
   * Test to verify that replaceEmojiToStr correctly converts an emoji with skin-tone-2 to its colon-wrapped short name and skin tone.
   */
  test('replaceEmojiToStr returns emoji short name with skintone-2', () => {
    expect(emojiDataInstance.replaceEmojiToStr('👋🏻')).toEqual(
      ':wave::skin-tone-2:',
    );
  });

  /**
   * Test to verify that replaceEmojiToStr correctly converts an emoji with skin-tone-3 to its colon-wrapped short name and skin tone.
   */
  test('replaceEmojiToStr returns emoji short name with skintone-3', () => {
    expect(emojiDataInstance.replaceEmojiToStr('🧛🏼')).toEqual(
      ':vampire::skin-tone-3:',
    );
  });

  /**
   * Test to verify that replaceEmojiToStr correctly converts an emoji with skin-tone-4 to its colon-wrapped short name and skin tone.
   */
  test('replaceEmojiToStr returns emoji short name with skintone-4', () => {
    expect(emojiDataInstance.replaceEmojiToStr('🫅🏽')).toEqual(
      ':person_with_crown::skin-tone-4:',
    );
  });

  /**
   * Test to verify that replaceEmojiToStr correctly converts an emoji with skin-tone-5 to its colon-wrapped short name and skin tone.
   */
  test('replaceEmojiToStr returns emoji short name with skintone-5', () => {
    expect(emojiDataInstance.replaceEmojiToStr('👶🏾')).toEqual(
      ':baby::skin-tone-5:',
    );
  });

  /**
   * Test to verify that replaceEmojiToStr correctly converts an emoji with skin-tone-6 to its colon-wrapped short name and skin tone.
   */
  test('replaceEmojiToStr returns emoji short name with skintone-6', () => {
    expect(emojiDataInstance.replaceEmojiToStr('👍🏿')).toEqual(
      ':+1::skin-tone-6:',
    );
  });

  /**
   * Test to verify that replaceEmojiToStr returns the original text when no emoji is found.
   */
  test('replaceEmojiToStr returns the same as input', () => {
    expect(emojiDataInstance.replaceEmojiToStr('aaaa')).toEqual('aaaa');
  });

  /**
   * Test to verify that getSkinInfo returns the correct emoji object without a skin tone.
   */
  test('getSkinInfo returns an emoji object without skintone', () => {
    const emoji = emojiDataInstance.getEmojiByName('smile');
    if (!emoji) throw new Error('smile emoji not found');

    expect(emojiDataInstance.getSkinInfo(emoji)).toEqual({
      image: '1f604.png',
      sheet_x: 32,
      sheet_y: 50,
      short_name: 'smile',
      unified: '1F604',
    });
  });

  /**
   * Test to verify that getSkinInfo returns the correct emoji object when multiple skin tones are available.
   * This test uses a custom emoji object representing people holding hands with skin variations.
   */
  test('getSkinInfo returns an emoji with multi-skintone', () => {
    const emojiWithMultiSkinTones = {
      name: 'PEOPLE HOLDING HANDS',
      unified: '1F9D1-200D-1F91D-200D-1F9D1',
      image: '1f9d1-200d-1f91d-200d-1f9d1.png',
      sheet_x: 49,
      sheet_y: 28,
      short_name: 'people_holding_hands',
      short_names: ['people_holding_hands'],
      category: 'People & Body',
      subcategory: 'family',
      skin_variations: {
        '1F3FB-1F3FB': {
          unified: '1F9D1-1F3FB-200D-1F91D-200D-1F9D1-1F3FB',
          non_qualified: null,
          image: '1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fb.png',
          sheet_x: 49,
          sheet_y: 29,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FB-1F3FC': {
          unified: '1F9D1-1F3FB-200D-1F91D-200D-1F9D1-1F3FC',
          non_qualified: null,
          image: '1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fc.png',
          sheet_x: 49,
          sheet_y: 30,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FB-1F3FD': {
          unified: '1F9D1-1F3FB-200D-1F91D-200D-1F9D1-1F3FD',
          non_qualified: null,
          image: '1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fd.png',
          sheet_x: 49,
          sheet_y: 31,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FB-1F3FE': {
          unified: '1F9D1-1F3FB-200D-1F91D-200D-1F9D1-1F3FE',
          non_qualified: null,
          image: '1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3fe.png',
          sheet_x: 49,
          sheet_y: 32,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FB-1F3FF': {
          unified: '1F9D1-1F3FB-200D-1F91D-200D-1F9D1-1F3FF',
          non_qualified: null,
          image: '1f9d1-1f3fb-200d-1f91d-200d-1f9d1-1f3ff.png',
          sheet_x: 49,
          sheet_y: 33,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FC-1F3FB': {
          unified: '1F9D1-1F3FC-200D-1F91D-200D-1F9D1-1F3FB',
          non_qualified: null,
          image: '1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fb.png',
          sheet_x: 49,
          sheet_y: 34,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FC-1F3FC': {
          unified: '1F9D1-1F3FC-200D-1F91D-200D-1F9D1-1F3FC',
          non_qualified: null,
          image: '1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fc.png',
          sheet_x: 49,
          sheet_y: 35,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FC-1F3FD': {
          unified: '1F9D1-1F3FC-200D-1F91D-200D-1F9D1-1F3FD',
          non_qualified: null,
          image: '1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fd.png',
          sheet_x: 49,
          sheet_y: 36,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FC-1F3FE': {
          unified: '1F9D1-1F3FC-200D-1F91D-200D-1F9D1-1F3FE',
          non_qualified: null,
          image: '1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3fe.png',
          sheet_x: 49,
          sheet_y: 37,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FC-1F3FF': {
          unified: '1F9D1-1F3FC-200D-1F91D-200D-1F9D1-1F3FF',
          non_qualified: null,
          image: '1f9d1-1f3fc-200d-1f91d-200d-1f9d1-1f3ff.png',
          sheet_x: 49,
          sheet_y: 38,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FD-1F3FB': {
          unified: '1F9D1-1F3FD-200D-1F91D-200D-1F9D1-1F3FB',
          non_qualified: null,
          image: '1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fb.png',
          sheet_x: 49,
          sheet_y: 39,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FD-1F3FC': {
          unified: '1F9D1-1F3FD-200D-1F91D-200D-1F9D1-1F3FC',
          non_qualified: null,
          image: '1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fc.png',
          sheet_x: 49,
          sheet_y: 40,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FD-1F3FD': {
          unified: '1F9D1-1F3FD-200D-1F91D-200D-1F9D1-1F3FD',
          non_qualified: null,
          image: '1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fd.png',
          sheet_x: 49,
          sheet_y: 41,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FD-1F3FE': {
          unified: '1F9D1-1F3FD-200D-1F91D-200D-1F9D1-1F3FE',
          non_qualified: null,
          image: '1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3fe.png',
          sheet_x: 49,
          sheet_y: 42,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FD-1F3FF': {
          unified: '1F9D1-1F3FD-200D-1F91D-200D-1F9D1-1F3FF',
          non_qualified: null,
          image: '1f9d1-1f3fd-200d-1f91d-200d-1f9d1-1f3ff.png',
          sheet_x: 49,
          sheet_y: 43,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FE-1F3FB': {
          unified: '1F9D1-1F3FE-200D-1F91D-200D-1F9D1-1F3FB',
          non_qualified: null,
          image: '1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fb.png',
          sheet_x: 49,
          sheet_y: 44,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FE-1F3FC': {
          unified: '1F9D1-1F3FE-200D-1F91D-200D-1F9D1-1F3FC',
          non_qualified: null,
          image: '1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fc.png',
          sheet_x: 49,
          sheet_y: 45,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FE-1F3FD': {
          unified: '1F9D1-1F3FE-200D-1F91D-200D-1F9D1-1F3FD',
          non_qualified: null,
          image: '1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fd.png',
          sheet_x: 49,
          sheet_y: 46,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FE-1F3FE': {
          unified: '1F9D1-1F3FE-200D-1F91D-200D-1F9D1-1F3FE',
          non_qualified: null,
          image: '1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3fe.png',
          sheet_x: 49,
          sheet_y: 47,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FE-1F3FF': {
          unified: '1F9D1-1F3FE-200D-1F91D-200D-1F9D1-1F3FF',
          non_qualified: null,
          image: '1f9d1-1f3fe-200d-1f91d-200d-1f9d1-1f3ff.png',
          sheet_x: 49,
          sheet_y: 48,
          added_in: '12.1',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FF-1F3FB': {
          unified: '1F9D1-1F3FF-200D-1F91D-200D-1F9D1-1F3FB',
          non_qualified: null,
          image: '1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fb.png',
          sheet_x: 49,
          sheet_y: 49,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FF-1F3FC': {
          unified: '1F9D1-1F3FF-200D-1F91D-200D-1F9D1-1F3FC',
          non_qualified: null,
          image: '1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fc.png',
          sheet_x: 49,
          sheet_y: 50,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FF-1F3FD': {
          unified: '1F9D1-1F3FF-200D-1F91D-200D-1F9D1-1F3FD',
          non_qualified: null,
          image: '1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fd.png',
          sheet_x: 49,
          sheet_y: 51,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FF-1F3FE': {
          unified: '1F9D1-1F3FF-200D-1F91D-200D-1F9D1-1F3FE',
          non_qualified: null,
          image: '1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3fe.png',
          sheet_x: 49,
          sheet_y: 52,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
        '1F3FF-1F3FF': {
          unified: '1F9D1-1F3FF-200D-1F91D-200D-1F9D1-1F3FF',
          non_qualified: null,
          image: '1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3ff.png',
          sheet_x: 49,
          sheet_y: 53,
          added_in: '12.0',
          has_img_apple: true,
          has_img_google: true,
          has_img_twitter: true,
          has_img_facebook: true,
        },
      },
      char: '🧑‍🤝‍🧑',
    } as IEmoji;

    const skinTone = 'skin-tone-6';
    const skin6 = emojiDataInstance.getEmojiByName(skinTone);
    if (!skin6 || !emojiWithMultiSkinTones.skin_variations) {
      throw new Error('Skin tone emoji or multi-skintone emoji not found');
    }

    // Check that the returned skin info object contains at least the required properties.
    expect(
      emojiDataInstance.getSkinInfo(emojiWithMultiSkinTones, skinTone),
    ).toEqual(
      expect.objectContaining({
        unified: '1F9D1-200D-1F91D-200D-1F9D1',
        short_name: 'skin-tone-6',
        image: '1f9d1-1f3ff-200d-1f91d-200d-1f9d1-1f3ff.png',
      }),
    );
  });
});
