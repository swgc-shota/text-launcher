import '@/common/appToggler/background/appToggler';
import { cruntime, cutils } from '@/common/customAPI/customAPI';

declare global {
  interface CMessageTypeMap {
    openOptionPage: 'openOptionPage';
  }
}
cutils.addListener('openOptionPage', () => {
  cruntime.openOptionsPage();
});
