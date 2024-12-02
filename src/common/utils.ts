import type { CMessageType } from '@/common/customAPI/customAPI';
export const fireCustomEvent = (
  customEventName: CMessageType,
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
