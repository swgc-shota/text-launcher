import van, { State } from "vanjs-core";
import { bounceIcon } from "./utils";
import type { ButtonConfig } from "../../utils/constants";
const { button, span } = van.tags;
const { svg, path } = van.tags("http://www.w3.org/2000/svg");

const SpeakIcon = (props: any = {}, children: HTMLElement[] = []) => {
  return svg(
    {
      viewBox: "0 -960 960 960",
      class: "size-5",
      ...props,
    },
    path({
      d: "M160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h326l-80 80H160v640h440v-80h80v80q0 33-23.5 56.5T600-80H160Zm80-160v-80h280v80H240Zm0-120v-80h200v80H240Zm360 0L440-520H320v-200h120l160-160v520Zm80-122v-276q36 21 58 57t22 81q0 45-22 81t-58 57Zm0 172v-84q70-25 115-86.5T840-620q0-78-45-139.5T680-846v-84q104 27 172 112.5T920-620q0 112-68 197.5T680-310Z",
    }),
    children
  );
};
function isEnglish(text: string, threshold: number = 0.8): boolean {
  if (!text) {
    return false;
  }

  const alphabet = new Set(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  );

  let alphaCount = 0;
  for (const char of text) {
    if (alphabet.has(char)) {
      alphaCount++;
    }
  }

  const totalCount = text.length;
  const alphaRatio = alphaCount / totalCount;

  return alphaRatio >= threshold;
}

const getSpeechLang = (lang: string) => {
  const langMap: { [key: string]: string } = {
    af: "af-ZA",
    sq: "sq-AL",
    ar: "ar-SA",
    hy: "hy-AM",
    az: "az-AZ",
    eu: "eu-ES",
    bn: "bn-BD",
    bg: "bg-BG",
    ca: "ca-ES",
    zh: "zh-CN",
    "zh-TW": "zh-TW",
    hr: "hr-HR",
    cs: "cs-CZ",
    da: "da-DK",
    nl: "nl-NL",
    en: "en-US",
    eo: "eo-EO",
    et: "et-EE",
    fi: "fi-FI",
    fr: "fr-FR",
    gl: "gl-ES",
    ka: "ka-GE",
    de: "de-DE",
    el: "el-GR",
    gu: "gu-IN",
    he: "he-IL",
    hi: "hi-IN",
    hu: "hu-HU",
    is: "is-IS",
    id: "id-ID",
    it: "it-IT",
    ja: "ja-JP",
    "en-JP": "ja-JP",
    kn: "kn-IN",
    ko: "ko-KR",
    lv: "lv-LV",
    lt: "lt-LT",
    mk: "mk-MK",
    ms: "ms-MY",
    ml: "ml-IN",
    mr: "mr-IN",
    ne: "ne-NP",
    no: "no-NO",
    fa: "fa-IR",
    pl: "pl-PL",
    pt: "pt-PT",
    "pt-BR": "pt-BR",
    pa: "pa-IN",
    ro: "ro-RO",
    ru: "ru-RU",
    sr: "sr-RS",
    sk: "sk-SK",
    sl: "sl-SI",
    es: "es-ES",
    sw: "sw-KE",
    sv: "sv-SE",
    ta: "ta-IN",
    te: "te-IN",
    th: "th-TH",
    tr: "tr-TR",
    uk: "uk-UA",
    ur: "ur-PK",
    vi: "vi-VN",
    cy: "cy-GB",
  };

  return langMap[lang] || lang;
};

const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  let speechLang = "";
  if (isEnglish(text)) {
    speechLang = "en-US";
  } else {
    const htmlLang = document.documentElement.lang;
    speechLang = htmlLang ? getSpeechLang(htmlLang) : "en-US";
  }

  utterance.lang = speechLang;
  speechSynthesis.speak(utterance);
};

export const SpeakButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string = ""
) =>
  button(
    {
      class: classes,
      onclick: (e: MouseEvent) => {
        bounceIcon(e.currentTarget as HTMLButtonElement);
        speakText(selectedText.val);
      },
    },
    span(config.buttonChar != "" ? config.buttonChar : SpeakIcon())
  );
