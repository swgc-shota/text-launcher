import { APP_NAME } from "../../utils/constants";

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
