import van, { State } from 'vanjs-core';
import { bounceIcon } from './utils';
import type { ButtonConfig } from '../../utils/constants';
import { isValidShareURLTemplate } from '../../utils/validation';

const { button, span } = van.tags;
const { svg, path } = van.tags('http://www.w3.org/2000/svg');

const shareText = (urlTemplate: string, query: string) => {
  if (!isValidShareURLTemplate(urlTemplate)) {
    console.error('Invalid URL template');
    return;
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = new URL(
      urlTemplate
        .replace('$TL-TEXT$', encodedQuery)
        .replace('$TL-URL$', window.location.href)
    );
    setTimeout(() => {
      window.open(searchUrl.href, '_blank');
    }, 100);
  } catch (error) {
    console.error('Error building search URL:', error);
  }
};

const ShareIcon = (props: any = {}, children: HTMLElement[] = []) => {
  return svg(
    {
      viewBox: '0 0 16 16',
      class: 'size-5',
      ...props,
    },
    path({
      d: 'M15 3a3 3 0 0 1-5.175 2.066l-3.92 2.179a2.994 2.994 0 0 1 0 1.51l3.92 2.179a3 3 0 1 1-.73 1.31l-3.92-2.178a3 3 0 1 1 0-4.133l3.92-2.178A3 3 0 1 1 15 3Zm-1.5 10a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 13.5 13Zm-9-5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 4.5 8Zm9-5a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 13.5 3Z',
    }),
    children
  );
};

export const ShareButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string
) =>
  button(
    {
      class: classes,
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        bounceIcon(e.currentTarget as HTMLButtonElement);
        shareText(config.shareUrl!, selectedText.val);
      },
    },
    span(config.buttonChar !== '' ? config.buttonChar : ShareIcon())
  );
