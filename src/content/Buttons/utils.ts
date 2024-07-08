export const bounceIcon = (button: HTMLButtonElement) => {
  const span = button.querySelector("span") as HTMLSpanElement;
  bounce(span);
};

const bounce = (target: HTMLElement | SVGElement) => {
  target.classList.add("animate-bounce-once");
  setTimeout(() => {
    target.classList.remove("animate-bounce-once");
  }, 500);
};
