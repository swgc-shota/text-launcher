import './text-launcher.css';
import { initAppStateToggler } from '@/common/appToggler/content/appToggler';
import {
  initTextLauncher,
  deinitTextLauncher,
} from './TextLauncher/TextLauncher';

const handleInitApp = () => initTextLauncher();
const handleDeinitApp = () => deinitTextLauncher();
initAppStateToggler(handleInitApp, handleDeinitApp);
