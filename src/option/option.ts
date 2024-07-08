import "./option.css";

import van /*, { State }*/ from "vanjs-core";
import * as vanX from "vanjs-ext";
import { ButtonConfig, ButtonType } from "../utils/constants";
import { fetchButtonConfigs, saveToLocalStorage } from "../utils/misc";
import {
  isValidSearchURLTemplate,
  isValidShareURLTemplate,
  isValidCharacter,
} from "../utils/validation";

const { div, h2, label, input, span, p } = van.tags;

interface ConfigCardProps {
  id: number;
  config: ButtonConfig;
}

const formatStateToButtonConfig = (config: any): ButtonConfig => {
  return {
    storageKey: config.storageKey,
    buttonType: config.buttonType,
    searchUrl: config.searchUrl,
    shareUrl: config.shareUrl,
    buttonChar: config.buttonChar,
  };
};

const ConfigCard = ({ id, config }: ConfigCardProps) => {
  const { storageKey } = config;
  const data = vanX.reactive({
    config: {
      storageKey: config.storageKey,
      buttonType: config.buttonType,
      searchUrl: config.searchUrl || "",
      shareUrl: config.shareUrl || "",
      buttonChar: config.buttonChar || "",
    },
    validation: {
      isValidSearchUrl: true,
      isValidShareUrl: true,
      isValidCharacter: true,
    },
  });

  const buttonTypes = ["search", "copy", "share", "speak"] as ButtonType[];

  return div(
    {
      class:
        "max-w-lg w-full mx-auto bg-white border border-stone-500 shadow-md rounded-md px-8 pt-8 mb-8",
    },
    h2({ class: "text-center text-xl font-bold mb-6" }, `Button #${id + 1}`),
    div(
      { class: "mb-8" },
      label({ class: "block font-medium mb-2" }, "Button Type:"),
      div(
        { class: "flex items-center space-x-4" },
        ...buttonTypes.map((type) =>
          label(
            { class: "flex items-center" },
            input({
              type: "radio",
              name: `buttonType--group${id}`,
              value: type,
              class: "form-radio text-yellow-500",
              checked: data.config.buttonType == type,
              onchange: () => {
                data.config.buttonType = type;
                saveToLocalStorage(
                  storageKey,
                  formatStateToButtonConfig(data.config)
                );
              },
            }),
            span(
              { class: "ml-2" },
              type.charAt(0).toUpperCase() + type.slice(1)
            )
          )
        )
      )
    ),
    () =>
      data.config.buttonType == "search"
        ? div(
            { class: "" },
            label({ class: "block font-medium mb-2" }, "Target URL:"),
            input({
              type: "text",
              class: "w-full border rounded p-2 bg-stone-50",
              placeholder: "",
              value: () => data.config.searchUrl,
              oninput: (e) => {
                data.config.searchUrl = e.target.value;
                if (isValidSearchURLTemplate(e.target.value)) {
                  data.validation.isValidSearchUrl = true;
                  saveToLocalStorage(
                    storageKey,
                    formatStateToButtonConfig(data.config)
                  );
                } else {
                  data.validation.isValidSearchUrl = false;
                }
              },
            }),
            div({ class: "h-8" }, () =>
              data.validation.isValidSearchUrl
                ? ""
                : p(
                    { class: "h-8 text-red-400" },
                    "Make sure to include '$TL-TEXT$' in the URL."
                  )
            )
          )
        : "",
    () =>
      data.config.buttonType == "share"
        ? div(
            { class: "" },
            label({ class: "block font-medium mb-2" }, "Target URL:"),
            input({
              type: "text",
              class: "w-full border rounded p-2 bg-stone-50",
              placeholder: "",
              value: () => data.config.shareUrl,
              oninput: (e) => {
                data.config.shareUrl = e.target.value;
                if (isValidShareURLTemplate(e.target.value)) {
                  data.validation.isValidShareUrl = true;
                  saveToLocalStorage(
                    storageKey,
                    formatStateToButtonConfig(data.config)
                  );
                } else {
                  data.validation.isValidShareUrl = false;
                }
              },
            }),
            div({ class: "h-8" }, () =>
              data.validation.isValidShareUrl
                ? ""
                : p(
                    { class: "text-red-400" },
                    "Make sure to include '$TL-TEXT$' and '$TL-URL$' in the URL."
                  )
            )
          )
        : "",
    div(
      label(
        { class: "block font-medium mb-2" },
        "Button Character (Optional):"
      ),
      input({
        type: "text",
        class: "w-[2rem] h-8 border rounded p-2 bg-stone-50",
        placeholder: "",
        value: data.config.buttonChar,
        oninput: (e) => {
          data.config.buttonChar = e.target.value;
          if (isValidCharacter(e.target.value)) {
            data.validation.isValidCharacter = true;
            saveToLocalStorage(
              storageKey,
              formatStateToButtonConfig(data.config)
            );
          } else {
            data.validation.isValidCharacter = false;
          }
        },
      }),
      div({ class: "h-8" }, () =>
        data.validation.isValidCharacter
          ? ""
          : p({ class: "text-red-400" }, "Only one character is allowed.")
      )
    )
  );
};

(async () => {
  const ConfigCards = (await fetchButtonConfigs()).map((config, index) =>
    ConfigCard({
      id: index,
      config: config,
    })
  );

  van.add(document.querySelector("main")!, ConfigCards);
})();
