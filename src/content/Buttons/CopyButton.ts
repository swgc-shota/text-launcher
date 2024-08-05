import van, { State } from "vanjs-core";
import { bounceIcon } from "./utils";
import type { ButtonConfig } from "../../utils/constants";
const { button, span } = van.tags;
const { svg, path } = van.tags("http://www.w3.org/2000/svg");

const copyText = async (text: string) => {
  if (!navigator.clipboard) {
    console.warn("Clipboard API not supported. Trying the old method.");
    fallbackCopyText(text);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.warn("Failed to copy text using Clipboard API: ", err);
    console.warn("Trying the old method.");
    fallbackCopyText(text);
  }
};

const fallbackCopyText = (text: string) => {
  const selection = document.getSelection();
  const range = selection!.rangeCount > 0 ? selection!.getRangeAt(0) : null;

  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      console.log("Text copied to clipboard using fallback method");
    } else {
      console.warn("Fallback method failed to copy text");
    }
  } catch (err) {
    console.error("Fallback method error: ", err);
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
    { viewBox: "0 -960 960 960", class: "size-5", ...props },
    path({
      d: "M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z",
    }),
    ...children
  );
};

export const CopyButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string = ""
) =>
  button(
    {
      class: classes,
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        bounceIcon(e.currentTarget as HTMLButtonElement);
        copyText(selectedText.val);
      },
    },
    span(config.buttonChar != "" ? config.buttonChar : CopyIcon())
  );
