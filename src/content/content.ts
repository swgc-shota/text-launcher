import "./content.css";

import { initTextLauncher, deinitTextLauncher } from "./TextLauncher";
import type { Message } from "../utils/constants";

import { fireCustomEvent } from "../utils/misc";
import { fetchFromLocalStorage } from "../utils/misc";
import { MY_EVT, MSG_TYPE, STOR_KEY, APP_STATUS } from "../utils/constants";

const initAppStateToggler = async (): Promise<void> => {
  chrome.runtime.onMessage.addListener(messageListener);
  const currentStatus = await fetchFromLocalStorage(STOR_KEY.APP_STATUS);
  if (currentStatus === APP_STATUS.OFF) {
    return;
  }

  initTextLauncher();
};

const messageListener = (
  message: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): boolean => {
  switch (message.type) {
    case MSG_TYPE.TOGGLE_APP:
      const isOn = message.newStatus === APP_STATUS.ON;
      if (isOn) {
        initTextLauncher();
        break;
      }
      fireCustomEvent(MY_EVT.TOGGLE_APP);
      deinitTextLauncher();
      break;
  }

  sendResponse();
  return true;
  /**
   * Reference:
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse
   */
};

initAppStateToggler();

export {};
