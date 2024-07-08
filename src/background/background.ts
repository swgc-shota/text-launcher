import { STOR_KEY, APP_STATUS, MSG_TYPE } from "../utils/constants";
import type { Message, AppStatus, ButtonConfig } from "../utils/constants";

const loadApp = async () => {
  // This event occurs when an extension is uploaded.
  chrome.runtime.onInstalled.addListener(initBadge);
  chrome.runtime.onInstalled.addListener(reloadAllTabs);
  // This event occurs when the browser is uploaded.
  chrome.runtime.onStartup.addListener(initBadge);
  chrome.runtime.onStartup.addListener(reloadAllTabs);
  /**
   * When the extension is installed, all tabs are reloaded.
   * However, When the extension is toggled on or off, tabs are not automatically reloaded.
   * Therefore, initApp() and reloadAllTabs() are explicitly called here.
   */
  await initApp();
  reloadAllTabs();
};

const reloadAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    // Filter out non-HTTP content such as chrome://, file://, etc.
    const isHttpOrHttps =
      tab.url &&
      (tab.url.startsWith("http://") || tab.url.startsWith("https://"));
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
        "search"
      ),
    });
    await chrome.storage.local.set({
      [STOR_KEY.BUTTON_CONFIG_1]: createButtonConfig(
        STOR_KEY.BUTTON_CONFIG_1,
        "copy"
      ),
    });
    await chrome.storage.local.set({
      [STOR_KEY.BUTTON_CONFIG_2]: createButtonConfig(
        STOR_KEY.BUTTON_CONFIG_2,
        "share",
        "https://www.google.com/search?q=$TL-TEXT$",
        "https://x.com/intent/post?text=$TL-TEXT$&url=$TL-URL$",
        "𝕏"
      ),
    });
    await chrome.storage.local.set({
      [STOR_KEY.BUTTON_CONFIG_3]: createButtonConfig(
        STOR_KEY.BUTTON_CONFIG_3,
        "speak"
      ),
    });
  }
};

const createButtonConfig = (
  storageKey: string,
  type: string,
  search: string = "https://www.google.com/search?q=$TL-TEXT$",
  share: string = "https://x.com/intent/post?text=$TL-TEXT$&url=$TL-URL$",
  char: string = ""
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
  const iconName = isNewStatusOff ? "icon16_off.png" : "icon16_on.png";
  chrome.action.setIcon({ path: `images/${iconName}` });
};

const initListeners = (): void => {
  chrome.action.onClicked.addListener(clickListener);
  chrome.runtime.onMessage.addListener(messageListener);
};

const clickListener = async (): Promise<void> => {
  const currentStatus: AppStatus = await getAppStatus();
  const isOn = currentStatus === APP_STATUS.ON;
  const newStatus = isOn ? APP_STATUS.OFF : APP_STATUS.ON;
  const message: Message = {
    type: MSG_TYPE.TOGGLE_APP,
    newStatus: newStatus,
  };
  toggleApp(message);
};

const messageListener = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  const _tabId = sender.tab?.id;
  const exceptTabIds = _tabId === undefined ? [] : [_tabId];

  switch (message.type) {
    case MSG_TYPE.TOGGLE_APP:
      toggleApp(message, exceptTabIds);
      break;

    case MSG_TYPE.OPEN_OPTION_PAGE:
      openOptionsPage();
      break;

    default:
      sendResponse({ type: MSG_TYPE.UNKNOWN });
  }

  sendResponse({ type: MSG_TYPE.SUCCESS });
};

const openOptionsPage = () => {
  chrome.runtime.openOptionsPage(() => {
    if (chrome.runtime.lastError) {
      console.error(`Error opening options page: ${chrome.runtime.lastError}`);
    } else {
      console.log("Options page opened successfully");
    }
  });
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
  const isHttpOrHttps = url.startsWith("http://") || url.startsWith("https://");
  if (!isHttpOrHttps) {
    return;
  }

  try {
    const messageResponse = await chrome.tabs.sendMessage(tabId, message);
    if (messageResponse === MSG_TYPE.FAILED) {
      console.warn("Message was received correctly, but processing failed.");
    }
  } catch (error) {
    console.warn(
      `Could not send a message to tab ${url} at ${new Date().toISOString()}:`,
      error
    );
  }
};

self.addEventListener("install", async () => loadApp());

/**
 * Since manifest v3,
 * background.js has become a service worker and is disabled when not in use.
 * To deal with this, run only initListener() here.
 */

initListeners();

export {};
