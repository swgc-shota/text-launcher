import type { StorageSchema } from '../appToggler/background/stroage';

declare global {
  interface CMessageTypeMap {
    success: 'success';
    failed: 'failed';
    unknown: 'unknown';
  }
}

export type CMessageType = CMessageTypeMap[keyof CMessageTypeMap];

export interface CMessage<T = unknown> {
  type: CMessageType;
  detail?: T;
}

export const cstorage = {
  ...chrome.storage,
  local: {
    ...chrome.storage.local,
    save: async (data: Partial<StorageSchema>) =>
      chrome.storage.local.set(data),
    fetchByKey: async <K extends keyof StorageSchema>(
      key: K
    ): Promise<StorageSchema[K] | undefined> => {
      return (await chrome.storage.local.get(key))[key];
    },
    fetchByKeys: async <K extends keyof StorageSchema>(
      keys: K[]
    ): Promise<{ [P in K]: StorageSchema[P] | undefined }> => {
      const result = await chrome.storage.local.get(keys);
      return keys.reduce((acc, key) => {
        acc[key] = result[key];
        return acc;
      }, {} as { [P in K]: StorageSchema[P] | undefined });
    },
  },
};

export const ctabs = chrome.tabs;
export const cruntime = {
  ...chrome.runtime,
  sendCMessage: async (
    message: CMessage,
    callback?: (response: any) => void
  ) => {
    if (callback) {
      chrome.runtime.sendMessage(message, callback);
    }
    chrome.runtime.sendMessage(message);
  },
};
export const caction = chrome.action;

declare global {
  // Type-safe storage interface using StorageSchema as a constraint
  interface CMessageTypeMap {
    success: 'success';
    failed: 'failed';
    unknown: 'unknown';
  }
}

interface MessageListener<T = unknown, U = unknown> {
  (detail: T, sender: chrome.runtime.MessageSender):
    | void
    | boolean
    | Promise<U>;
}

class Utils {
  private listeners = new Map<
    CMessageType,
    MessageListener<unknown, unknown>
  >();

  constructor() {
    cruntime.onMessage.addListener(
      async (
        message: CMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: unknown) => void
      ): Promise<boolean | void> => {
        if (!message?.type || !this.listeners.has(message.type)) {
          return;
        }

        const listener = this.listeners.get(message.type);
        if (!listener) {
          console.warn(`No listener found for message type: ${message.type}`);
          sendResponse({ type: 'failed', detail: 'Listener not found' });
          return;
        }

        try {
          const result = listener(message.detail, sender);

          if (result instanceof Promise) {
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Response timeout')), 5000);
            });

            try {
              const data = await Promise.race([result, timeoutPromise]);
              sendResponse({ type: 'success', detail: data });
            } catch (error) {
              sendResponse({
                type: 'failed',
                detail:
                  error instanceof Error ? error.message : 'Unknown error',
              });
            }
            return true;
          }

          return result;
        } catch (error) {
          console.error('Error handling message:', error);
          sendResponse({
            type: 'failed',
            detail: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    );
  }

  addListener<T, U>(type: CMessageType, listener: MessageListener<T, U>) {
    this.listeners.set(type, listener as MessageListener<unknown, unknown>);
  }

  removeListener(type: CMessageType) {
    this.listeners.delete(type);
  }
}

export const cutils = new Utils();
