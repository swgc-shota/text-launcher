export const APP_NAME = "text-launcher";

export const MSG_TYPE = {
  TOGGLE_APP: "text-launcher--0",
  SUCCESS: "text-launcher--1",
  FAILED: "text-launcher--2",
  UNKNOWN: "text-launcher--3",
  OPEN_OPTION_PAGE: `text-launcher--4`,
} as const;
export const MY_EVT = { ...MSG_TYPE } as const;

export const APP_STATUS = {
  ON: "1",
  OFF: "0",
} as const;

export const COPY_MODE = {
  BOTH: "0",
  SINGLE: "1",
} as const;

export const STOR_KEY = {
  APP_STATUS: "APP_STATUS",
  COPY_MODE: "COPY_MODE",
} as const;

export const BTN_TYPE = {
  URL: "url",
  TEXT: "text",
} as const;
