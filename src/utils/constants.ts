export const APP_NAME = 'text-launcher';
export const MSG_TYPE = {
  TOGGLE_APP: '0',
  SUCCESS: '1',
  FAILED: '2',
  UNKNOWN: '3',
  OPEN_OPTION_PAGE: `4`,
  IS_INSTALLED: `5`,
} as const;
type MessageType = (typeof MSG_TYPE)[keyof typeof MSG_TYPE];

export const APP_STATUS = {
  ON: '1',
  OFF: '0',
} as const;
export type AppStatus = (typeof APP_STATUS)[keyof typeof APP_STATUS];

export type Message = {
  readonly type: MessageType;
  readonly newStatus?: AppStatus;
};

export const BTN_CONF_KEYS = {
  BTN0: 'B0',
  BTN1: 'B1',
  BTN2: 'B2',
  BTN3: 'B3',
};
export type BtnConfKeys = (typeof BTN_CONF_KEYS)[keyof typeof BTN_CONF_KEYS];

export const STOR_KEYS = {
  APP_STATUS: 'AS',
  ...BTN_CONF_KEYS,
} as const;

export type StorKey = (typeof STOR_KEYS)[keyof typeof STOR_KEYS];

export type ButtonConfig = {
  storageKey: string;
  buttonType: string;
  searchUrl?: string;
  shareUrl?: string;
  buttonChar?: string;
};

export const BUTTON_TYPE = {
  COPY: 'copy',
  SEARCH: 'search',
  SHARE: 'share',
  SPEAK: 'speak',
  NOTE: 'note',
} as const;
export type ButtonType = (typeof BUTTON_TYPE)[keyof typeof BUTTON_TYPE];
