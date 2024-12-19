import van, { State } from 'vanjs-core';
import { bounceIcon } from './utils';
import type { ButtonConfig } from '@/common/appToggler/background/stroage';
const { button, span } = van.tags;
const { svg, path } = van.tags('http://www.w3.org/2000/svg');

const copyText = async (text: string) => {
  if (!navigator.clipboard) {
    console.warn('Clipboard API not supported. Trying the old method.');
    fallbackCopyText(text);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.warn('Failed to copy text using Clipboard API: ', err);
    console.warn('Trying the old method.');
    fallbackCopyText(text);
  }
};

const fallbackCopyText = (text: string) => {
  const selection = document.getSelection();
  const range = selection!.rangeCount > 0 ? selection!.getRangeAt(0) : null;

  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      console.log('Text copied to clipboard using fallback method');
    } else {
      console.warn('Fallback method failed to copy text');
    }
  } catch (err) {
    console.error('Fallback method error: ', err);
  } finally {
    document.body.removeChild(textArea);

    if (range && selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

const CopyIcon = (props: any = {}, children: HTMLElement[] = []) => {
  return svg(
    { viewBox: '0 0 16 16', class: 'size-5', ...props },
    path({
      d: 'M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z',
    }),
    path({
      d: 'M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z',
    }),
    ...children
  );
};

export const CopyButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string = ''
) =>
  button(
    {
      title: 'Copy Button',
      class: classes,
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        bounceIcon(e.currentTarget as HTMLButtonElement);
        copyText(selectedText.val);
      },
    },
    span(config.buttonChar != '' ? config.buttonChar : CopyIcon())
  );
