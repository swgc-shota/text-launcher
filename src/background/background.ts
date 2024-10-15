import { STOR_KEY, APP_STATUS, MSG_TYPE } from '../utils/constants';
import type { Message, AppStatus, ButtonConfig } from '../utils/constants';

const reloadAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    // Filter out non-HTTP content such as chrome://, file://, etc.
    const isHttpOrHttps =
      tab.url &&
      (tab.url.startsWith('http://') || tab.url.startsWith('https://'));
    if (tab.id && isHttpOrHttps) {
      chrome.tabs.reload(tab.id);
    }
  }
};

const initApp = async () => {
  await initStorage();
  await initBadge();
};

const initStorage = async (): Promise<void> => {
  const currentStatus = await getAppStatus();
  if (currentStatus === undefined) {
    await chrome.storage.local.set({
      [STOR_KEY.APP_STATUS]: APP_STATUS.ON,
    });
    await chrome.storage.local.set({
      [STOR_KEY.BUTTON_CONFIG_0]: createButtonConfig(
        STOR_KEY.BUTTON_CONFIG_0,
        'search'
      ),
    });
    await chrome.storage.local.set({
      [STOR_KEY.BUTTON_CONFIG_1]: createButtonConfig(
        STOR_KEY.BUTTON_CONFIG_1,
        'copy'
      ),
    });
    await chrome.storage.local.set({
      [STOR_KEY.BUTTON_CONFIG_2]: createButtonConfig(
        STOR_KEY.BUTTON_CONFIG_2,
        'share',
        'https://www.google.com/search?q=$TL-TEXT$',
        'https://x.com/intent/post?text=$TL-TEXT$&url=$TL-URL$',
        '𝕏'
      ),
    });
    await chrome.storage.local.set({
      [STOR_KEY.BUTTON_CONFIG_3]: createButtonConfig(
        STOR_KEY.BUTTON_CONFIG_3,
        'speak'
      ),
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

const getAppStatus = async (): Promise<AppStatus> => {
  const { APP_STATUS } = await chrome.storage.local.get(STOR_KEY.APP_STATUS);
  return APP_STATUS;
};

const initBadge = async (): Promise<void> => {
  const appStatus = await getAppStatus();
  updateBadge(appStatus);
};

const updateBadge = (newStatus: AppStatus) => {
  const isNewStatusOff = newStatus === APP_STATUS.OFF;
  const iconName = isNewStatusOff ? 'icon16_off.png' : 'icon16_on.png';
  chrome.action.setIcon({ path: `images/${iconName}` });
};

const toggleApp = async (message: Message, exceptTabIds: number[] = []) => {
  await sendMessageToAllTabs(message, exceptTabIds);
  await chrome.storage.local.set({
    [STOR_KEY.APP_STATUS]: message.newStatus,
  });
  updateBadge(message.newStatus as AppStatus);
};

const sendMessageToAllTabs = async (
  message: Message,
  exceptTabIds: number[] = []
): Promise<void> => {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || !tab.url) {
      continue;
    }
    if (exceptTabIds.includes(tab.id)) {
      continue;
    }
    sendMessageToValidTab(tab.id, tab.url, message);
  }
};

const sendMessageToValidTab = async (
  tabId: number,
  url: string,
  message: Message
) => {
  // Filter out non-HTTP content such as chrome://, file://, etc.
  const isHttpOrHttps = url.startsWith('http://') || url.startsWith('https://');
  if (!isHttpOrHttps) {
    return;
  }

  try {
    const messageResponse = await chrome.tabs.sendMessage(tabId, message);
    if (messageResponse === MSG_TYPE.FAILED) {
      console.warn('Message was received correctly, but processing failed.');
    }
  } catch (error) {
    console.warn(
      `Could not send a message to tab ${url} at ${new Date().toISOString()}:`,
      error
    );
  }
};

const sw: ServiceWorkerGlobalScope = self as any;

// Extenstion restarted
sw.addEventListener('activate', async (_: ExtendableEvent) => {
  await initBadge();
});

// Extension installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  await initApp();
  await reloadAllTabs();
});
// Browser launched (includes updated)
chrome.runtime.onStartup.addListener(async () => {
  await initBadge();
});

chrome.action.onClicked.addListener(async (): Promise<void> => {
  const currentStatus: AppStatus = await getAppStatus();
  const isOn = currentStatus === APP_STATUS.ON;
  const newStatus = isOn ? APP_STATUS.OFF : APP_STATUS.ON;
  const message: Message = {
    type: MSG_TYPE.TOGGLE_APP,
    newStatus: newStatus,
  };
  toggleApp(message);
});

const openOptionsPage = () => {
  chrome.runtime.openOptionsPage(() => {
    if (chrome.runtime.lastError) {
      console.error(`Error opening options page: ${chrome.runtime.lastError}`);
    }
  });
};

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    handleMessage(message, sender).then(sendResponse);
    return true;
  }
);

async function handleMessage(
  message: Message,
  sender: chrome.runtime.MessageSender
) {
  const _tabId = sender.tab?.id;
  const exceptTabIds = _tabId === undefined ? [] : [_tabId];
  let result = {};

  try {
    switch (message.type) {
      case MSG_TYPE.TOGGLE_APP:
        await toggleApp(message, exceptTabIds);
        break;

      case MSG_TYPE.OPEN_OPTION_PAGE:
        await openOptionsPage();
        break;
      /*
      case MSG_TYPE.IS_INSTALLED:
        result = {
          isExtensionInstalled: await isExtensionInstalled(
            "gfdikilcklflffnhapfibppbfoaaemle"
          ),
        };
        break;
*/
      default:
        return { type: MSG_TYPE.UNKNOWN };
    }
    return { type: MSG_TYPE.SUCCESS, ...result };
  } catch (error) {
    return { type: MSG_TYPE.UNKNOWN, error: error };
  }
}
/*
const isExtensionInstalled = (extensionId: string) => {
  return new Promise((resolve) => {
    chrome.management.get(extensionId, (_) => {
      if (chrome.runtime.lastError) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
*/
