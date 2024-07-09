export const APP_NAME = "text-launcher";
export const MSG_TYPE = {
  TOGGLE_APP: "text-launcher--0",
  SUCCESS: "text-launcher--1",
  FAILED: "text-launcher--2",
  UNKNOWN: "text-launcher--3",
  OPEN_OPTION_PAGE: `text-launcher--4`,
} as const;
type MessageType = (typeof MSG_TYPE)[keyof typeof MSG_TYPE];

export const APP_STATUS = {
  ON: "1",
  OFF: "0",
} as const;
export type AppStatus = (typeof APP_STATUS)[keyof typeof APP_STATUS];

export type Message = {
  readonly type: MessageType;
  readonly newStatus?: AppStatus;
};

export const MY_EVT = {
  ...MSG_TYPE,
  REMOVE_CONTAINER: "text-launcher--5",
} as const;

export const BUTTON_CONFIG_KEY = {
  BUTTON_CONFIG_0: "BUTTON_CONFIG_0",
  BUTTON_CONFIG_1: "BUTTON_CONFIG_1",
  BUTTON_CONFIG_2: "BUTTON_CONFIG_2",
  BUTTON_CONFIG_3: "BUTTON_CONFIG_3",
};
export type ButtonConfigKey =
  (typeof BUTTON_CONFIG_KEY)[keyof typeof BUTTON_CONFIG_KEY];

export const STOR_KEY = {
  APP_STATUS: "APP_STATUS",
  ...BUTTON_CONFIG_KEY,
} as const;

export type StorKey = (typeof STOR_KEY)[keyof typeof STOR_KEY];

export type ButtonConfig = {
  storageKey: string;
  buttonType: string;
  searchUrl?: string;
  shareUrl?: string;
  buttonChar?: string;
};

export const BUTTON_TYPE = {
  COPY: "copy",
  SEARCH: "search",
  SHARE: "share",
  SPEAK: "speak",
} as const;
export type ButtonType = (typeof BUTTON_TYPE)[keyof typeof BUTTON_TYPE];
