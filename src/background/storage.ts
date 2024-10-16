import { STOR_KEYS, APP_STATUS } from '../utils/constants';
import type { ButtonConfig } from '../utils/constants';
import { fetchFromLocalStorage } from '../utils/misc';

export const initStorage = async (): Promise<void> => {
  const currentStatus = await fetchFromLocalStorage(STOR_KEYS.APP_STATUS);
  if (currentStatus === undefined) {
    await chrome.storage.local.set({
      [STOR_KEYS.APP_STATUS]: APP_STATUS.ON,
    });
    await chrome.storage.local.set({
      [STOR_KEYS.BTN0]: createButtonConfig(STOR_KEYS.BTN0, 'search'),
    });
    await chrome.storage.local.set({
      [STOR_KEYS.BTN1]: createButtonConfig(STOR_KEYS.BTN1, 'copy'),
    });
    await chrome.storage.local.set({
      [STOR_KEYS.BTN2]: createButtonConfig(
        STOR_KEYS.BTN2,
        'share',
        'https://www.google.com/search?q=$TL-TEXT$',
        'https://x.com/intent/post?text=$TL-TEXT$&url=$TL-URL$',
        '𝕏'
      ),
    });
    await chrome.storage.local.set({
      [STOR_KEYS.BTN3]: createButtonConfig(STOR_KEYS.BTN3, 'speak'),
    });
  }
};

const createButtonConfig = (
  storageKey: string,
  type: string,
  search: string = 'https://www.google.com/search?q=$TL-TEXT$',
  share: string = 'https://x.com/intent/post?text=$TL-TEXT$&url=$TL-URL$',
  char: string = ''
): ButtonConfig => {
  return {
    storageKey,
    buttonType: type,
    searchUrl: search,
    shareUrl: share,
    buttonChar: char,
  };
};
