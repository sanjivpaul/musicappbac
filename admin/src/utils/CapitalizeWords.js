export const CapitalizeWords = (sentence) => {
  if (!sentence || typeof sentence !== "string") {
    return ""; // or return sentence if you want to keep it as-is
  }

  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
