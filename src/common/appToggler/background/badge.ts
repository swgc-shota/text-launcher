import { cstorage, caction } from '@/common/customAPI/customAPI';

export const initBadge = async (): Promise<void> => {
  const isAppOn = await cstorage.local.fetchByKey('isAppOn');
  await toggleStatusBadge(isAppOn!);
};

export const toggleStatusBadge = async (isOn: boolean) => {
  const iconName = isOn ? 'icon16_on.png' : 'icon16_off.png';
  await caction.setIcon({ path: `images/${iconName}` });
};
