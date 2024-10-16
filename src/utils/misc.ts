import type { ButtonConfig, Message, StorKey } from './constants';
import { BTN_CONF_KEYS } from './constants';

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
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result[key]);
    });
  });
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
  for (const [_, key] of Object.entries(BTN_CONF_KEYS)) {
    result.push(await fetchFromLocalStorage(key));
  }
  return result;
};

type MyEventName = 'appoff';
export const fireCustomEvent = (
  customEventName: MyEventName,
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
