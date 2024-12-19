import van, { State } from 'vanjs-core';
import { bounceIcon } from './utils';
import type { ButtonConfig } from '@/common/appToggler/background/stroage';
const { button, span } = van.tags;
const { svg, path } = van.tags('http://www.w3.org/2000/svg');

const SpeakIcon = (props: any = {}, children: HTMLElement[] = []) => {
  return svg(
    {
      viewBox: '0 0 16 16',
      class: 'size-5',
      ...props,
    },
    path({
      d: 'M7.563 2.069A.75.75 0 0 1 8 2.75v10.5a.751.751 0 0 1-1.238.57L3.472 11H1.75A1.75 1.75 0 0 1 0 9.25v-2.5C0 5.784.784 5 1.75 5h1.723l3.289-2.82a.75.75 0 0 1 .801-.111ZM6.5 4.38 4.238 6.319a.748.748 0 0 1-.488.181h-2a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h2c.179 0 .352.064.488.18L6.5 11.62Zm6.096-2.038a.75.75 0 0 1 1.06 0 8 8 0 0 1 0 11.314.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042 6.5 6.5 0 0 0 0-9.193.75.75 0 0 1 0-1.06Zm-1.06 2.121-.001.001a5 5 0 0 1 0 7.07.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734 3.5 3.5 0 0 0 0-4.95.75.75 0 1 1 1.061-1.061Z',
    }),
    children
  );
};
function isEnglish(text: string, threshold: number = 0.8): boolean {
  if (!text) {
    return false;
  }

  const alphabet = new Set(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  );

  // スペースと一般的な句読点を除去した文字数をカウント
  const cleanText = text.replace(/[\s.,'"]/g, '');
  const totalCount = cleanText.length;

  let alphaCount = 0;
  for (const char of cleanText) {
    if (alphabet.has(char)) {
      alphaCount++;
    }
  }

  const alphaRatio = alphaCount / totalCount;
  return alphaRatio >= threshold;
}

const getSpeechLang = (lang: string) => {
  const langMap: { [key: string]: string } = {
    af: 'af-ZA',
    sq: 'sq-AL',
    ar: 'ar-SA',
    hy: 'hy-AM',
    az: 'az-AZ',
    eu: 'eu-ES',
    bn: 'bn-BD',
    bg: 'bg-BG',
    ca: 'ca-ES',
    zh: 'zh-CN',
    'zh-TW': 'zh-TW',
    hr: 'hr-HR',
    cs: 'cs-CZ',
    da: 'da-DK',
    nl: 'nl-NL',
    en: 'en-US',
    eo: 'eo-EO',
    et: 'et-EE',
    fi: 'fi-FI',
    fr: 'fr-FR',
    gl: 'gl-ES',
    ka: 'ka-GE',
    de: 'de-DE',
    el: 'el-GR',
    gu: 'gu-IN',
    he: 'he-IL',
    hi: 'hi-IN',
    hu: 'hu-HU',
    is: 'is-IS',
    id: 'id-ID',
    it: 'it-IT',
    ja: 'ja-JP',
    'en-JP': 'ja-JP',
    kn: 'kn-IN',
    ko: 'ko-KR',
    lv: 'lv-LV',
    lt: 'lt-LT',
    mk: 'mk-MK',
    ms: 'ms-MY',
    ml: 'ml-IN',
    mr: 'mr-IN',
    ne: 'ne-NP',
    no: 'no-NO',
    fa: 'fa-IR',
    pl: 'pl-PL',
    pt: 'pt-PT',
    'pt-BR': 'pt-BR',
    pa: 'pa-IN',
    ro: 'ro-RO',
    ru: 'ru-RU',
    sr: 'sr-RS',
    sk: 'sk-SK',
    sl: 'sl-SI',
    es: 'es-ES',
    sw: 'sw-KE',
    sv: 'sv-SE',
    ta: 'ta-IN',
    te: 'te-IN',
    th: 'th-TH',
    tr: 'tr-TR',
    uk: 'uk-UA',
    ur: 'ur-PK',
    vi: 'vi-VN',
    cy: 'cy-GB',
  };

  return langMap[lang] || lang;
};

const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);

  if (isEnglish(text)) {
    utterance.lang = 'en-US';

    const naturalVoices = speechSynthesis
      .getVoices()
      .filter((v) =>
        v.voiceURI.includes('(Natural) - English (United States)')
      );
    if (naturalVoices.length !== 0) {
      utterance.voice = naturalVoices[1];
    }
  } else {
    const htmlLang = document.documentElement.lang;
    utterance.lang = htmlLang ? getSpeechLang(htmlLang) : 'en-US';
  }

  speechSynthesis.speak(utterance);
};

export const SpeakButton = (
  selectedText: State<string>,
  config: ButtonConfig,
  classes: string = ''
) =>
  button(
    {
      class: classes,
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        bounceIcon(e.currentTarget as HTMLButtonElement);
        speakText(selectedText.val);
      },
    },
    span(config.buttonChar != '' ? config.buttonChar : SpeakIcon())
  );
