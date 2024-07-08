import van, { State } from "vanjs-core";
import { bounceIcon } from "./utils";
import { isValidSearchURLTemplate } from "../../utils/validation";

import type { ButtonConfig } from "../../utils/constants";
const { button, span } = van.tags;
const { svg, path } = van.tags("http://www.w3.org/2000/svg");

const searchText = (urlTemplate: string, query: string) => {
  if (!isValidSearchURLTemplate(urlTemplate)) {
    console.error("Invalid URL template");
    return;
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = new URL(urlTemplate.replace("$TL-TEXT$", encodedQuery));
    setTimeout(() => {
      window.open(searchUrl.href, "_blank");
    }, 100);
  } catch (error) {
    console.error("Error building search URL:", error);
  }
};

const SearchIcon = (props: any = {}, children: HTMLElement[] = []) => {
  return svg(
    {
      viewBox: "0 -960 960 960",
      class: "size-6",
      ...props,
    },
    path({
      d: "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
    }),
    children
  );
};

export const SearchButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string = ""
) =>
  button(
    {
      class: classes,
      onclick: (e: MouseEvent) => {
        bounceIcon(e.currentTarget as HTMLButtonElement);
        searchText(config.searchUrl!, selectedText.val);
      },
    },
    span(config.buttonChar != "" ? config.buttonChar : SearchIcon())
  );
