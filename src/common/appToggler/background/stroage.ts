import { cstorage } from '@/common/customAPI/customAPI';

export interface StorageSchema extends ButtonsSchema, AppStatusSchema {}

export type AppStatusSchema = {
  isAppOn: boolean;
};

export const initStorage = async (): Promise<void> => {
  const isAppOn = await cstorage.local.fetchByKey('isAppOn');
  if (isAppOn !== undefined) {
    return;
  }

  await cstorage.local.save({
    isAppOn: true,
    button0: createButtonConfig('search'),
    button1: createButtonConfig('copy'),
    button2: createButtonConfig(
      'share',
      'https://www.google.com/search?q=$TL-TEXT$',
      'https://x.com/intent/post?text=$TL-TEXT$&url=$TL-URL$',
      '𝕏'
    ),
    button3: createButtonConfig('speak'),
  });
};

export type ButtonType = 'copy' | 'search' | 'share' | 'speak' | 'note';

export interface ButtonConfig {
  buttonType: ButtonType;
  searchUrl?: string;
  shareUrl?: string;
  buttonChar?: string;
}

export type ButtonId = 'button0' | 'button1' | 'button2' | 'button3';

export type ButtonsSchema = {
  [K in ButtonId]: ButtonConfig;
};

export type StorageKey = keyof StorageSchema;

const createButtonConfig = (
  type: ButtonType,
  search: string = 'https://www.google.com/search?q=$TL-TEXT$',
  share: string = 'https://x.com/intent/post?text=$TL-TEXT$&url=$TL-URL$',
  char: string = ''
): ButtonConfig => {
  return {
    buttonType: type,
    searchUrl: search,
    shareUrl: share,
    buttonChar: char,
  } as ButtonConfig;
};
