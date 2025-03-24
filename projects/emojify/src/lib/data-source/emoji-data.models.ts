/**
 * Represents an emoji with its associated metadata.
 *
 * @property {string} name - The full name of the emoji.
 * @property {string} unified - The unified Unicode string representation of the emoji.
 * @property {string} image - The filename (or path) for the emoji image.
 * @property {number} sheet_x - The x-coordinate of the emoji on the sprite sheet.
 * @property {number} sheet_y - The y-coordinate of the emoji on the sprite sheet.
 * @property {string} short_name - The primary short name of the emoji.
 * @property {string[]} short_names - A list of alternative short names for the emoji.
 * @property {string} category - The category to which the emoji belongs (e.g. "Smileys & Emotion").
 * @property {string} subcategory - The subcategory of the emoji.
 * @property {string} char - The actual emoji character.
 * @property {{ [key: string]: SkinVariationData | undefined }} [skin_variations] - Optional mapping of skin tone codes to their corresponding skin variation data.
 * @property {string} [obsoleted_by] - If present, indicates an emoji that obsoletes this one.
 * @property {string} [obsoletes] - If present, indicates an emoji that is obsoleted by this one.
 */
export interface IEmoji {
  name: string;
  unified: string;
  image: string;
  sheet_x: number;
  sheet_y: number;
  short_name: string;
  short_names: string[];
  category: string;
  subcategory: string;
  char: string;
  skin_variations?: { [key: string]: SkinVariationData };
  obsoleted_by?: string;
  obsoletes?: string;
}

/**
 * Represents the image details of an emoji within a sprite sheet.
 *
 * @property {number} x - The computed x-coordinate (scaled) on the sprite sheet.
 * @property {number} y - The computed y-coordinate (scaled) on the sprite sheet.
 * @property {number} sheetSizeX - The overall width of the sprite sheet.
 * @property {number} sheetSizeY - The overall height of the sprite sheet.
 * @property {string} image - The filename or URL of the emoji image.
 */
export interface EmojiImage {
  x: number;
  y: number;
  sheetSizeX: number;
  sheetSizeY: number;
  image: string;
}

/**
 * An array of emoji categories used to group related emojis.
 * Categories include groups like "Smileys & Emotion", "People & Body", and others.
 */
export const CategoryData = [
  'Activities',
  'Animals & Nature',
  'Component',
  'Flags',
  'Food & Drink',
  'Objects',
  'People & Body',
  'Smileys & Emotion',
  'Symbols',
  'Travel & Places',
];

/**
 * Represents the data for a skin variation of an emoji.
 *
 * @property {string} unified - The unified Unicode string for the skin variation.
 * @property {string | null} non_qualified - A non-qualified Unicode string, if available.
 * @property {string} image - The filename (or path) of the emoji image for this skin variation.
 * @property {number} sheet_x - The x-coordinate of the skin variation on the sprite sheet.
 * @property {number} sheet_y - The y-coordinate of the skin variation on the sprite sheet.
 * @property {string} added_in - The version in which the skin variation was added.
 * @property {boolean} has_img_apple - Indicates if Apple provides an image for this variation.
 * @property {boolean} has_img_google - Indicates if Google provides an image for this variation.
 * @property {boolean} has_img_twitter - Indicates if Twitter provides an image for this variation.
 * @property {boolean} has_img_facebook - Indicates if Facebook provides an image for this variation.
 * @property {string} [obsoleted_by] - Optionally, the emoji that obsoletes this variation.
 * @property {string} [obsoletes] - Optionally, the emoji that is obsoleted by this variation.
 */
export interface SkinVariationData {
  unified: string;
  non_qualified: null | string;
  image: string;
  sheet_x: number;
  sheet_y: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
  obsoleted_by?: string;
  obsoletes?: string;
}

/**
 * Represents the data for a skin variation of an emoji.
 *
 * @property {number} sheet_x - The x-coordinate of the skin variation on the sprite sheet.
 * @property {number} sheet_y - The y-coordinate of the skin variation on the sprite sheet.
 * @property {string} unified - The unified Unicode string for the skin variation.
 * @property {string} short_name - The primary short name of the emoji.
 * @property {string} image - The filename (or path) of the emoji image for this skin variation.
 */
export interface EmoijSkinImageData {
  sheet_x: number;
  sheet_y: number;
  unified: string;
  short_name: string;
  image: string;
}
