import van from "vanjs-core";
const { svg, path } = van.tags("http://www.w3.org/2000/svg");

export const OptionIcon = () => {
  return svg(
    { viewBox: "0 -960 960 960", class: "size-5 fill-white" },
    path({
      d: "M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z",
    })
  );
};
