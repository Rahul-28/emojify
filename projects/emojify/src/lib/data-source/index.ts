import {
  CategoryData,
  type EmoijSkinImageData,
  type EmojiImage,
  type IEmoji,
} from './emoji-data.models';
import emojiJsonData from './emoji.json';

const emojis: IEmoji[] = emojiJsonData as IEmoji[];

export const sheetColumns = 61;
export const sheetRows = 61;

/**
 * A class to process, search, and convert emoji data.
 *
 * This class provides methods to:
 * - Map raw emoji JSON data to useful lookup maps.
 * - Convert Unicode values into actual emoji characters.
 * - Remove unnecessary properties from the raw data.
 * - Search and retrieve emoji images.
 */
export class EmojiData {
  // Map to quickly find an emoji by its short name.
  private emojiValMap: Map<string, IEmoji> = new Map();

  // Map to lookup an emoji by its Unicode character.
  private emojiUnifiedValMap: Map<string, IEmoji> = new Map();

  // Lookup table for emojis by category (excluding skin tones).
  public emojiCategoryLookUp: Map<string, IEmoji[]> = new Map();

  // Regular expression to match emoji characters (optionally with skin tone modifier).
  public readonly emojiUnicodeRegex = this.initUnified();

  constructor() {
    this.initEmojiMap();
  }

  /**
   * Filters and returns only those emojis that have skin variations.
   *
   * @returns {IEmoji[]} An array of emojis with skin variations.
   */
  public getVariationEmojis(): IEmoji[] {
    return emojis.filter((emoji) => emoji.skin_variations != null);
  }

  /**
   * Retrieves the image data for an emoji represented as a colon-wrapped string.
   * Example: ":smile:" or ":spock-hand::skin-tone-4:"
   *
   * @param {string} emojiStrWithColon - The emoji string wrapped in colons.
   * @returns {EmojiImage | null} The emoji image data or null if not found.
   */
  public getImageDataWithColon(emojiStrWithColon: string): EmojiImage | null {
    // Remove colons at the beginning and end.
    const emojiStr = emojiStrWithColon.replace(/^(:+)|(:+)$/g, '');
    return this.getImageData(emojiStr);
  }

  /**
   * Retrieves the image data for the given emoji string.
   *
   * If the emoji string contains a skin tone modifier (e.g. "::skin-tone-4"),
   * it extracts the skin tone and finds the corresponding emoji variation.
   *
   * @param {string} emojiStr - The emoji string (without colons).
   * @returns {EmojiImage | null} The emoji image data or null if not found.
   */
  public getImageData(emojiStr: string): EmojiImage | null {
    // Check if the emoji string includes a skin tone modifier.
    emojiStr = emojiStr.toLowerCase();
    if (emojiStr.indexOf('::skin-tone-') === -1) {
      const emojiVal = this.emojiValMap.get(emojiStr);
      if (emojiVal != null && emojiVal.category !== 'Skin Tones') {
        return this.findImage(emojiVal);
      }
      return null;
    }

    // Extract skin tone information.
    const match = emojiStr.match(/skin-tone-(\d+)/);
    const skinTone = match ? match[1] : null;
    // Get the skin tone modifier emoji from the map.
    const skinVal = this.emojiValMap.get(`skin-tone-${skinTone}`);
    // Remove the skin tone portion from the emoji string.
    const emojiIdx = emojiStr.substring(0, emojiStr.length - 13);
    const emojiVal = this.emojiValMap.get(emojiIdx);

    if (emojiVal != null) {
      return this.findImage(emojiVal, skinVal);
    }
    return null;
  }

  /**
   * Retrieves an emoji object by its short name.
   *
   * @param {string} emojiStr - The short name of the emoji.
   * @returns {IEmoji | undefined} The emoji object, or undefined if not found.
   */
  public getEmojiByName(emojiStr: string): IEmoji | undefined {
    emojiStr = emojiStr.toLowerCase();
    return this.emojiValMap.get(emojiStr);
  }

  /**
   * Searches for emojis whose short names contain the given substring.
   * Returns up to a specified limit of matching emojis.
   *
   * @param {string} emojiStr - The substring to search for.
   * @param {number} limit - The maximum number of results to return.
   * @returns {IEmoji[]} An array of matching emoji objects.
   */
  public searchEmoji(emojiStr: string, limit: number): IEmoji[] {
    const result: { index: number; emoji: IEmoji }[] = [];

    for (const emoji of emojis) {
      const index = emoji.short_name.indexOf(emojiStr);
      if (index > -1 && !this.hasSkinTone(emoji.short_name)) {
        result.push({ index, emoji });
      }
    }

    return result
      .sort((a, b) => a.emoji.short_name.length - b.emoji.short_name.length)
      .sort((a, b) => a.index - b.index)
      .map((a) => a.emoji)
      .slice(0, limit);
  }

  /**
   * Determines whether the given string represents a skin tone.
   *
   * @param {string} skinTone - The string to test.
   * @returns {boolean} True if the string contains 'skin-tone-', false otherwise.
   */
  public hasSkinTone(skinTone: string): boolean {
    return skinTone != null && skinTone.indexOf('skin-tone-') > -1;
  }

  /**
   * Replaces emoji characters in a string with their corresponding colon-wrapped short names.
   * For example, 😀 might be replaced with :grinning:.
   *
   * @param {string} text - The input text.
   * @returns {string} The text with emojis replaced by their short names.
   */
  public replaceEmojiToStr(text: string): string {
    return text.replace(this.emojiUnicodeRegex, (m, p1) => {
      return this.convertUniToStr(m, p1);
    });
  }

  /**
   * Retrieves skin variation information for an emoji.
   *
   * If a skin tone is provided and it is a valid skin tone, the function attempts
   * to locate the corresponding skin tone variation and returns its image data.
   *
   * @param {IEmoji} emoji - The base emoji object.
   * @param {string} [skinTone] - An optional skin tone string.
   * @returns {object} An object containing sheet coordinates, unified code, short name, and image URL.
   */
  public getSkinInfo = (
    emoji: IEmoji,
    skinTone?: string,
  ): EmoijSkinImageData => {
    if (skinTone != null && this.hasSkinTone(skinTone)) {
      const skinEmoji = this.emojiValMap.get(skinTone);
      const pos = this.findImage(emoji, skinEmoji);
      return {
        sheet_x: pos.x,
        sheet_y: pos.y,
        unified: emoji.unified,
        short_name: skinTone,
        image: pos.image,
      };
    }

    return {
      sheet_x: emoji.sheet_x,
      sheet_y: emoji.sheet_y,
      unified: emoji.unified,
      short_name: emoji.short_name,
      image: emoji.image,
    };
  };

  /**
   * Converts a Unicode string to a colon-wrapped short name.
   *
   * This function is used as part of replacing emoji characters in a string with their short names.
   *
   * @param {string} emojiUni - The original emoji Unicode string.
   * @param {string} withoutSkinToneUni - The Unicode string without any skin tone modifiers.
   * @returns {string} A string in the format :short_name: if found, otherwise returns the original Unicode string.
   */
  convertUniToStr(emojiUni: string, withoutSkinToneUni: string): string {
    const emoji = this.emojiUnifiedValMap.get(withoutSkinToneUni);

    if (emoji != null) {
      return `:${emoji.short_name}:`;
    }
    return emojiUni;
  }

  /**
   * Initializes lookup maps for emojis from the raw data.
   *
   * Populates:
   * - emojiValMap: Maps each short name to its emoji object.
   * - emojiUnifiedValMap: Maps each emoji character to its emoji object.
   * - emojiCategoryLookUp: Organizes emojis by their category (excluding skin tone modifiers).
   *
   * @returns {void}
   */
  private initEmojiMap(): void {
    for (const eachEmoji of emojis) {
      // Map each short name to the emoji.
      for (const name of eachEmoji.short_names) {
        this.emojiValMap.set(name, eachEmoji);
      }
      // Map the actual emoji character to the emoji.
      this.emojiUnifiedValMap.set(eachEmoji.char, eachEmoji);
    }
    const modifierCategory = 'Skin Tones';

    // Build lookup for categories other than skin tones.
    for (const eachCategory of CategoryData) {
      if (eachCategory !== modifierCategory) {
        const categorizedEmojiArray = emojis.filter(
          (eachEmoji) => eachEmoji.category === eachCategory,
        );
        this.emojiCategoryLookUp.set(eachCategory, categorizedEmojiArray);
      }
    }
  }

  /**
   * Initializes a regular expression to match emoji characters.
   *
   * It builds an array of emoji characters (with special characters escaped)
   * and then creates a regex that can match any of those emojis, optionally
   * followed by a skin tone modifier.
   *
   * @returns {RegExp} The constructed regular expression.
   */
  initUnified(): RegExp {
    const emojiChars: string[] = [];
    for (const e of emojis) {
      // Escape '*' to avoid regex conflicts.
      emojiChars.push(e.char.replace('*', '\\*'));
    }

    // Sort by length in descending order to match longer sequences first.
    emojiChars.sort((a, b) => b.length - a.length);
    return new RegExp(`(${emojiChars.join('|')})([\u{DFFB}-\u{DFFF}])?`, 'gu');
  }

  /**
   * Finds the image data for an emoji, optionally with a variation (e.g., skin tone).
   *
   * Calculates the image coordinates on a sprite sheet based on the emoji's sheet positions
   * and the overall sheet dimensions.
   *
   * @param {IEmoji} actual - The base emoji object.
   * @param {IEmoji} [variation] - An optional emoji object representing a variation (such as a skin tone).
   * @returns {EmojiImage} The object containing the image URL and the calculated coordinates.
   */
  findImage = (actual: IEmoji, variation?: IEmoji): EmojiImage => {
    const sheetSizeX = 100 * sheetColumns;
    const sheetSizeY = 100 * sheetRows;
    const multiplyX = 100 / (sheetColumns - 1);
    const multiplyY = 100 / (sheetRows - 1);

    // If a variation is provided and the base emoji has skin variations,
    // try to find the corresponding variation image.
    if (actual.skin_variations != null && variation != null) {
      const foundEmoji =
        actual.skin_variations[variation.unified] ||
        actual.skin_variations[`${variation.unified}-${variation.unified}`];

      return {
        x: foundEmoji ? foundEmoji.sheet_x * multiplyX : 0,
        y: foundEmoji ? foundEmoji.sheet_y * multiplyY : 0,
        sheetSizeX,
        sheetSizeY,
        image: foundEmoji ? foundEmoji.image : '',
      };
    }

    // If no variation, return the base emoji's image data.
    return {
      x: actual.sheet_x * multiplyX,
      y: actual.sheet_y * multiplyY,
      sheetSizeX,
      sheetSizeY,
      image: actual.image,
    };
  };
}
