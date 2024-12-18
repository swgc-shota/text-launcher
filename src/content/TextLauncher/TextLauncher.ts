import { prepareContainer } from '../utils/customElementsPolyfill';
import van, { State } from 'vanjs-core';
import { fireCustomEvent } from '@/common/utils';
import { SpeakButton } from '../Buttons/SpeakButton';
import { ShareButton } from '../Buttons/ShareButton';
import { CopyButton } from '../Buttons/CopyButton';
import { SearchButton } from '../Buttons/SearchButton';
import { NoteButton } from '../Buttons/NoteButton';
import type { ButtonConfig } from '@/common/appToggler/background/stroage';
import { selectComponent } from '../utils/queryHelpers';
import { cruntime, cstorage } from '@/common/customAPI/customAPI';

const { div, button } = van.tags;
const { svg, path } = van.tags('http://www.w3.org/2000/svg');

const initTextLauncher = async () => {
  const container = prepareContainer('text-launcher');
  container.addElement(await TextLauncher());
};

declare global {
  interface CMessageTypeMap {
    appOff: 'appOff';
  }
}
const deinitTextLauncher = () => {
  fireCustomEvent('appOff');
  const container = document.querySelector('text-launcher');
  if (container) {
    container?.remove();
  }
};

const addExternalEventListeners = (
  isVisible: State<boolean>,
  selectedText: State<string>
) => {
  const hideLauncher = (_: Event) => {
    isVisible.val = false;
    document.removeEventListener('selectionchange', hideLauncher);
  };

  const visibleLauncher = (e: MouseEvent) => {
    //Ignore a mouseup event on launcher ui.
    const launcher = selectComponent('text-launcher');
    if (launcher == null || launcher.contains(e.target as HTMLElement)) {
      e.preventDefault();
      return;
    }

    const selection = window.getSelection();
    if (selection === null || isVisible.val) {
      return;
    }

    const _selectedText = selection.toString();
    if (
      selection.type === 'None' ||
      selection.type === 'Caret' ||
      _selectedText === ''
    ) {
      hideLauncher(e);
      return;
    }

    selectedText.val = _selectedText;
    isVisible.val = true;
    updateLauncherCoord(e, launcher);

    document.addEventListener('selectionchange', hideLauncher);

    launcher.classList.add('scale-100');
  };
  document.addEventListener('mouseup', visibleLauncher);

  // Update the UI after settings on the options page have been changed
  const rebootLauncher = () => {
    if (document.visibilityState !== 'visible') {
      return;
    }
    deinitTextLauncher();
    setTimeout(() => initTextLauncher());
  };
  document.addEventListener('visibilitychange', rebootLauncher);

  const removeExternalListeners = () => {
    document.removeEventListener('mouseup', visibleLauncher);
    document.removeEventListener('visibilitychange', rebootLauncher);
    document.removeEventListener('appOff', deinitTextLauncher);
  };
  document.addEventListener('appOff', removeExternalListeners);
};

const updateLauncherCoord = (e: MouseEvent, launcher: HTMLElement) => {
  const coord = generateCoordinate(e);
  launcher.style['top'] = coord.y + 'px';
  launcher.style['left'] = coord.x + 'px';
};

const generateCoordinate = (e: MouseEvent) => {
  const coord = {
    x: e.clientX,
    y: e.clientY - 48,
  };

  return coord;
};

const assignButton = (
  id: number,
  config: ButtonConfig,
  selectedText: State<string>
): HTMLButtonElement => {
  let buttonClasses =
    'grid size-10 text-2xl place-items-center hover:bg-amber-400 ';
  buttonClasses += id == 0 ? 'rounded-l' : '';
  buttonClasses += id == 3 ? 'rounded-r' : '';

  switch (config.buttonType) {
    case 'search':
      return SearchButton(selectedText, config, buttonClasses);
    case 'copy':
      return CopyButton(selectedText, config, buttonClasses);
    case 'share':
      return ShareButton(selectedText, config, buttonClasses);
    case 'speak':
      return SpeakButton(selectedText, config, buttonClasses);
    case 'note':
      return NoteButton(selectedText, config, buttonClasses);
    default:
      return button('Something wrong!');
  }
};

const TextLauncher = async () => {
  const selectedText = van.state('');
  const isVisible = van.state(false);
  addExternalEventListeners(isVisible, selectedText);

  const buttonConfigs = [] as ButtonConfig[];
  buttonConfigs.push((await cstorage.local.fetchByKey('button0'))!);
  buttonConfigs.push((await cstorage.local.fetchByKey('button1'))!);
  buttonConfigs.push((await cstorage.local.fetchByKey('button2'))!);
  buttonConfigs.push((await cstorage.local.fetchByKey('button3'))!);

  const Buttons = buttonConfigs.map((config, index) => {
    return assignButton(index, config, selectedText);
  });

  return div(
    {
      'data-component-name': 'text-launcher',
      class: () =>
        `fixed flex w-auto flex-row divide-x-[1px] divide-dashed bg-yellow-500 text-white fill-yellow-50 shadow-md shadow-stone-400 transition-transform duration-100 rounded z-max ${
          isVisible.val ? 'scale-100' : 'scale-0'
        }`,
    },
    Buttons,
    button(
      {
        class: 'grid place-items-center  hover:bg-amber-400 rounded-r',
        onclick: (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          cruntime.sendMessage({ type: 'openOptionPage' });
        },
      },
      svg(
        { viewBox: '0 -960 960 960', class: 'size-5 fill-white' },
        path({
          d: 'M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z',
        })
      )
    )
  );
};

export { initTextLauncher, deinitTextLauncher };
