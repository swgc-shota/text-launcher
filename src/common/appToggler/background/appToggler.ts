import {
  initBadge,
  toggleStatusBadge,
} from '@/common/appToggler/background/badge';
import { initStorage } from '@/common/appToggler/background/stroage';
import {
  cstorage,
  ctabs,
  cruntime,
  caction,
} from '@/common/customAPI/customAPI';
import type { CMessage } from '@/common/customAPI/customAPI';

const reloadAllTabs = async () => {
  const tabs = await ctabs.query({})!;
  for (const tab of tabs) {
    // Filter out non-HTTP content such as chrome://, file://, etc.
    const isHttpOrHttps =
      tab.url &&
      (tab.url.startsWith('http://') || tab.url.startsWith('https://'));
    if (tab.id && isHttpOrHttps) {
      ctabs.reload(tab.id);
    }
  }
};

const initApp = async () => {
  await initStorage();
  await initBadge();
};

const sendMessageToAllTabs = async <T>(
  message: CMessage<T>,
  exceptTabIds: number[] = []
): Promise<void> => {
  const tabs = await ctabs.query({})!;
  for (const tab of tabs) {
    if (!tab.id || !tab.url || exceptTabIds.includes(tab.id)) {
      continue;
    } else if (tab.discarded) {
      await ctabs.reload(tab.id);
      continue;
    }
    sendMessageToValidTab<T>(tab.id, tab.url, message);
  }
};

const sendMessageToValidTab = async <T>(
  tabId: number,
  url: string,
  message: CMessage<T>
) => {
  // Filter out non-HTTP content such as chrome://, file://, etc.
  const isHttpOrHttps = url.startsWith('http://') || url.startsWith('https://');
  if (!isHttpOrHttps) {
    return;
  }

  try {
    const res = (await ctabs.sendMessage(tabId, message)) as CMessage<T>;
    if (res.type === 'failed') {
      console.warn('Message was received correctly, but processing failed.');
    }
  } catch (error) {
    console.warn(
      `Could not send a message to tab ${url} at ${new Date().toISOString()}:`,
      error
    );
  }
};

declare global {
  interface CMessageTypeMap {
    type: 'toggleApp';
  }
  interface DocumentEventMap extends CMessageTypeMap {}
}
export interface ToggleAppDetail {
  isAppOn: boolean;
}
const toggleApp = async () => {
  const newStatus = !(await cstorage.local.fetchByKey('isAppOn'));
  const message = {
    type: 'toggleApp',
    detail: { isAppOn: newStatus },
  } as CMessage<ToggleAppDetail>;

  await cstorage.local.save({ isAppOn: newStatus });
  await sendMessageToAllTabs(message);
  toggleStatusBadge(newStatus);
};

caction.onClicked.addListener(toggleApp);

// Extenstion restarted
(self as any).addEventListener('activate', async (_: ExtendableEvent) => {
  await initApp();
});

// Extension installed or updated
cruntime.onInstalled.addListener(async () => {
  await reloadAllTabs();
});

// Browser launched (includes updated)
cruntime.onStartup.addListener(async () => {
  await initBadge();
});
