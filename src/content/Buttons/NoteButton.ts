import van, { State } from 'vanjs-core';
import { cruntime } from '@/common/customAPI/customAPI';
import { bounceIcon } from './utils';
import type { ButtonConfig } from '@/common/appToggler/background/stroage';
const { button, span } = van.tags;
const { svg, path } = van.tags('http://www.w3.org/2000/svg');

const sendTextToClickNote = async (text: string, shiftKey: boolean) => {
  try {
    await sendMessage(text, shiftKey);
  } catch (err) {
    alert(
      "Sorry, I couldn't send selected text to ClickNote. It may be turned off or not installed."
    );
    console.warn('Failed to send message to ClickNote: ', err);
  }
};

const sendMessage = (selectedText: string, shiftKey: boolean) => {
  return new Promise((resolve, reject) => {
    cruntime.sendMessage(
      'gfdikilcklflffnhapfibppbfoaaemle',
      {
        type: 'insertSelectedText',
        selectedText: selectedText,
        title: document.title ? document.title : 'No title',
        url: location.href ? location.href : 'No url',
        shiftKey: shiftKey,
      },
      (response) => {
        if (cruntime.lastError) {
          reject(cruntime.lastError);
        } else {
          resolve(response);
        }
      }
    );
  });
};

const NoteIcon = (props: any = {}) => {
  return svg(
    { viewBox: '0 0 16 16', class: 'size-5', ...props },
    path({
      d: 'M.989 8 .064 2.68a1.342 1.342 0 0 1 1.85-1.462l13.402 5.744a1.13 1.13 0 0 1 0 2.076L1.913 14.782a1.343 1.343 0 0 1-1.85-1.463L.99 8Zm.603-5.288L2.38 7.25h4.87a.75.75 0 0 1 0 1.5H2.38l-.788 4.538L13.929 8Z',
      fill: 'white',
    })
  );
};

export const NoteButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string = ''
) =>
  button(
    {
      class: classes,
      title: 'Note Button',
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        bounceIcon(e.currentTarget as HTMLButtonElement);
        sendTextToClickNote(selectedText.val, e.shiftKey);
      },
    },
    span(config.buttonChar != '' ? config.buttonChar : NoteIcon())
  );
