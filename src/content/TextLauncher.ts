import { prepareContainer } from "./utils/customElementsPolyfill";
import van, { State } from "vanjs-core";
import { sendMessageToBackground, fetchButtonConfigs } from "../utils/misc";
import { fireCustomEvent } from "./utils/utils";
import { MSG_TYPE, BUTTON_TYPE, MY_EVT } from "../utils/constants";
import { SpeakButton } from "./Buttons/SpeakButton";
import { ShareButton } from "./Buttons/ShareButton";
import { CopyButton } from "./Buttons/CopyButton";
import { SearchButton } from "./Buttons/SearchButton";
import { OptionIcon } from "./utils/buttonListeners";
import type { ButtonConfig } from "../utils/constants";
import { selectComponent } from "./utils/utils";

const { div, button } = van.tags;

const initTextLauncher = async () => {
  const container = prepareContainer("text-launcher");
  container.addElement(await TextLauncher());
};

const deinitTextLauncher = () => {
  const container = document.querySelector("text-launcher");
  if (container == null) {
    console.warn("TextLauncher doesn't exist.");
  }
  fireCustomEvent(MY_EVT.REMOVE_CONTAINER);
  container?.remove();
};

const addExternalEventListeners = (
  isVisible: State<boolean>,
  selectedText: State<string>
) => {
  const hideLauncher = () => {
    isVisible.val = false;
    document.removeEventListener("selectionchange", hideLauncher);
  };

  const visibleLauncher = (e: MouseEvent) => {
    const selection = window.getSelection();
    if (selection === null || isVisible.val) {
      return;
    }

    const _selectedText = selection.toString();
    if (
      selection.type === "None" ||
      selection.type === "Caret" ||
      _selectedText === ""
    ) {
      hideLauncher();
      return;
    }

    //Ignore a mouseup event on launcher ui.
    const launcher = selectComponent("text-launcher");
    if (launcher.contains(e.target as HTMLElement)) {
      return;
    }

    selectedText.val = _selectedText;
    isVisible.val = true;
    updateLauncherCoord(e, launcher);

    document.addEventListener("selectionchange", hideLauncher);

    launcher.classList.add("scale-100");
  };
  document.addEventListener("mouseup", visibleLauncher);

  const rebootLauncher = () => {
    if (document.visibilityState !== "visible") {
      return;
    }
    deinitTextLauncher();
    setTimeout(() => initTextLauncher());
  };
  document.addEventListener("visibilitychange", rebootLauncher);

  const removeExternalListeners = () => {
    document.removeEventListener("mouseup", visibleLauncher);
    document.removeEventListener("visibilitychange", rebootLauncher);
    document.removeEventListener(MY_EVT.REMOVE_CONTAINER, deinitTextLauncher);
  };
  document.addEventListener(MY_EVT.REMOVE_CONTAINER, removeExternalListeners);
};

const updateLauncherCoord = (e: MouseEvent, launcher: HTMLElement) => {
  const coord = generateCoordinate(e);
  launcher.style["top"] = coord.y + "px";
  launcher.style["left"] = coord.x + "px";
};

const generateCoordinate = (e: MouseEvent) => {
  const itemWidth = 128;
  const itemHeight = 30;
  const coord = {
    x: e.clientX + 1,
    y: e.clientY + 1,
  };
  if (window.innerWidth - e.clientX < itemWidth) {
    coord.x -= itemWidth + 2 < coord.x ? itemWidth + 2 : coord.x;
  }
  if (window.innerHeight - e.clientY < itemHeight) {
    coord.y -= itemHeight;
  }
  return coord;
};

const assignButton = (
  id: number,
  config: ButtonConfig,
  selectedText: State<string>
): HTMLButtonElement => {
  let buttonClasses =
    "grid size-10 text-2xl place-items-center hover:bg-amber-400 ";
  buttonClasses += id == 0 ? "rounded-l" : "";
  buttonClasses += id == 3 ? "rounded-r" : "";

  switch (config.buttonType) {
    case BUTTON_TYPE.SEARCH:
      return SearchButton(selectedText, config, buttonClasses);
    case BUTTON_TYPE.COPY:
      return CopyButton(selectedText, config, buttonClasses);
    case BUTTON_TYPE.SHARE:
      return ShareButton(selectedText, config, buttonClasses);
    case BUTTON_TYPE.SPEAK:
      return SpeakButton(selectedText, config, buttonClasses);
    default:
      return button("Something wrong!");
  }
};

const TextLauncher = async () => {
  const selectedText = van.state("");
  const isVisible = van.state(false);
  addExternalEventListeners(isVisible, selectedText);

  const Buttons = (await fetchButtonConfigs()).map((config, index) => {
    return assignButton(index, config, selectedText);
  });

  return div(
    {
      "data-component-name": "text-launcher",
      class: () =>
        `fixed flex w-auto flex-row divide-x-[1px] divide-dashed bg-yellow-500 text-white fill-yellow-50 shadow-md shadow-stone-400 transition-transform duration-100 rounded z-max ${
          isVisible.val ? "scale-100" : "scale-0"
        }`,
    },
    Buttons,
    button(
      {
        class: "grid place-items-center  hover:bg-amber-400 rounded-r",
        onclick: (_: MouseEvent) => {
          sendMessageToBackground({
            type: MSG_TYPE.OPEN_OPTION_PAGE,
          });
        },
      },
      OptionIcon()
    )
  );
};

export { initTextLauncher, deinitTextLauncher };
