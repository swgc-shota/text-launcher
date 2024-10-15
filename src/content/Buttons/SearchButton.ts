import van, { State } from 'vanjs-core';
import { bounceIcon } from './utils';
import { isValidSearchURLTemplate } from '../../utils/validation';

import type { ButtonConfig } from '../../utils/constants';
const { button, span } = van.tags;
const { svg, path } = van.tags('http://www.w3.org/2000/svg');

const searchText = (urlTemplate: string, query: string) => {
  if (!isValidSearchURLTemplate(urlTemplate)) {
    console.error('Invalid URL template');
    return;
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = new URL(urlTemplate.replace('$TL-TEXT$', encodedQuery));
    setTimeout(() => {
      window.open(searchUrl.href, '_blank');
    }, 100);
  } catch (error) {
    console.error('Error building search URL:', error);
  }
};

const SearchIcon = (props: any = {}, children: HTMLElement[] = []) => {
  return svg(
    {
      viewBox: '0 0 16 16',
      class: 'size-5',
      ...props,
    },
    path({
      d: 'M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z',
    }),
    children
  );
};

export const SearchButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string = ''
) =>
  button(
    {
      class: classes,
      onpointerover: (_: PointerEvent) => console.log('pointerevent!'),
      onpointerdown: (_) => console.log('pointerdown'),
      onclick: (e: MouseEvent) => {
        console.log('Seach Button Clicked!');
        e.preventDefault();
        e.stopPropagation();
        bounceIcon(e.currentTarget as HTMLButtonElement);
        searchText(config.searchUrl!, selectedText.val);
      },
    },
    span(config.buttonChar != '' ? config.buttonChar : SearchIcon())
  );
