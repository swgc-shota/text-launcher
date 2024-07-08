/**
 * The Rollup feature mentioned below,
 * I placed the same utils.ts in both the background and content directories.
 *
 * > Notice how both entry points import the same shared chunk. Rollup will
 * never duplicate code and instead create additional chunks to only ever load
 * the bare minimum necessary.
 * Tutorial | Rollup | https://rollupjs.org/tutorial/
 */
import { APP_NAME } from "./constant";

let timerId: NodeJS.Timeout | undefined = undefined;
export const createCallbackTimer = (callback: () => void) => {
  const set = (ms: number) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(callback, ms);
  };
  const clear = () => clearTimeout(timerId);

  return {
    set,
    clear,
  };
};

export const getDate = (): string => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const selectComponent = (compName: string) =>
  document
    .querySelector(APP_NAME)
    ?.shadowRoot?.querySelector(
      `[data-component-name="${compName}"]`
    ) as HTMLElement;

export const selectComponentAll = (compName: string) =>
  document
    .querySelector(APP_NAME)
    ?.shadowRoot?.querySelectorAll(
      `[data-component-name="${compName}"]`
    ) as NodeList;

export const selectInShadowRoot = (selector: string) =>
  document.querySelector(APP_NAME)?.shadowRoot?.querySelector(selector);

export const selectAllInShadowRoot = (selector: string) =>
  document.querySelector(APP_NAME)?.shadowRoot?.querySelectorAll(selector);

export const fireCustomEvent = (
  customEventName: string,
  detail: any = {},
  element: Element | Document = document
) => {
  const event = new CustomEvent(customEventName, {
    detail: detail,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
};
