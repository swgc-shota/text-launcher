export const isValidSearchURLTemplate = (template: string): boolean => {
  if (template === "") {
    return true;
  }
  try {
    if (template.split("$TL-TEXT$").length != 2) {
      return false;
    }
    new URL(template.replace("$TL-TEXT$", "TEMP_PLACEHOLDER"));
    return true;
  } catch {
    return false;
  }
};

export const isValidShareURLTemplate = (template: string): boolean => {
  if (template === "") {
    return true;
  }
  try {
    if (template.split("$TL-TEXT$").length !== 2) return false;
    if (template.split("$TL-URL$").length !== 2) return false;
    new URL(
      template
        .replace("$TL-TEXT$", "TEMP_PLACEHOLDER")
        .replace("$TL-URL$", "TEMP_PLACEHOLDER")
    );
    return true;
  } catch {
    return false;
  }
};

export const isValidCharacter = (text: string): boolean => {
  if (text == "") {
    return true;
  }
  const trimmedText = text.replace(/\s/g, "");
  // Requires the array.from method to distinguish surrogate pair
  return Array.from(trimmedText).length === 1;
};
