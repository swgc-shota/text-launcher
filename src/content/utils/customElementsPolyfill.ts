import '@webcomponents/custom-elements/custom-elements.min.js';
import '../text-launcher.css';

class ContentScriptContainer extends HTMLElement {
  private container: HTMLDivElement;
  constructor() {
    super();
    this.container = document.createElement('div');
    const shadowRoot = this.attachShadow({ mode: 'open' });

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.runtime.getURL('text-launcher.css');

    shadowRoot.appendChild(style);

    // This setTimeout() is needed to prevent FOUC
    setTimeout(() => {
      shadowRoot.appendChild(this.container);
    }, 100);
  }

  addElement(dom: HTMLElement) {
    this.container.appendChild(dom);
  }
  removeElement(dom: HTMLElement) {
    this.container.removeChild(dom);
  }
}

export const prepareContainer = (
  elementName: string
): ContentScriptContainer => {
  if (!window.customElements.get(elementName)) {
    window.customElements.define(elementName, ContentScriptContainer);
  }
  const container = document.createElement(
    elementName
  ) as ContentScriptContainer;
  document.body.appendChild(container);
  return container;
};
