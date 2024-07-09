import { BUTTON_CONFIG_KEY } from "./constants";
import type { ButtonConfig, Message, StorKey } from "./constants";

export const sendMessageToBackground = async (message: Message) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
};

export const fetchFromLocalStorage = async <T>(key: StorKey): Promise<T> => {
  const _temp = await chrome.storage.local.get(key);
  return _temp[key];
};

export const saveToLocalStorage = async (
  key: string,
  value: any
): Promise<void> => {
  try {
    await chrome.storage.local.set({ [key]: value });
  } catch (error: any) {
    console.error(`Failed to save data for key "${key}":`, error);
    throw new Error(`Storage operation failed: ${error.message}`);
  }
};

export const fetchButtonConfigs = async () => {
  const result = [] as ButtonConfig[];
  for (const [_, value] of Object.entries(BUTTON_CONFIG_KEY)) {
    result.push(await fetchFromLocalStorage(value));
  }
  return result;
};

export const fireCustomEvent = (
  customEventName: string,
  detail: any = {},
  element: Element | Document = document
) => {
  const event = new CustomEvent(customEventName, {
    detail: detail,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};
