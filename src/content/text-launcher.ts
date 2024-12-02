import './text-launcher.css';
import { initAppStateToggler } from '@/common/appToggler/content/appToggler';
import {
  initTextLauncher,
  deinitTextLauncher,
} from './TextLauncher/TextLauncher';

const handleInitApp = () => {
  console.log('init!!!!');
  initTextLauncher();
};

const handleDeinitApp = () => {
  console.log('deinit!!!!');
  deinitTextLauncher();
};

initAppStateToggler(handleInitApp, handleDeinitApp);
