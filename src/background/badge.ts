import { fetchFromLocalStorage } from '../utils/misc';
import type { AppStatus } from '../utils/constants';
import { APP_STATUS, STOR_KEYS } from '../utils/constants';

export const initBadge = async (): Promise<void> => {
  const appStatus = await fetchFromLocalStorage(STOR_KEYS.APP_STATUS);
  updateBadge(appStatus as AppStatus);
};

export const updateBadge = (newStatus: AppStatus) => {
  console.log('@newStatus');
  console.log(newStatus);
  const isNewStatusOff = newStatus === APP_STATUS.OFF;
  const iconName = isNewStatusOff ? 'icon16_off.png' : 'icon16_on.png';
  chrome.action.setIcon({ path: `images/${iconName}` });
};
