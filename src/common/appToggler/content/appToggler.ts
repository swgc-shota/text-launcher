import { fireCustomEvent } from '@/common/utils';
import { cstorage, cutils } from '@/common/customAPI/customAPI';

import type { ToggleAppDetail } from '@/common/appToggler/background/appToggler';

export const initAppStateToggler = async (
  initApp: () => void,
  deinitApp: () => void
): Promise<void> => {
  const handleToggleApp = ({ isAppOn }: ToggleAppDetail, _sender: any) => {
    if (isAppOn) {
      initApp();
    } else {
      fireCustomEvent('toggleApp', { isAppOn: isAppOn });
      deinitApp();
    }
    return true;
  };
  cutils.addListener('toggleApp', handleToggleApp);

  const isAppOn = await cstorage.local.fetchByKey('isAppOn');
  isAppOn && initApp();
};
