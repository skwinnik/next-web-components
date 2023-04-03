export const createCustomElement = (
  tagName: string,
  createElementClass: () => CustomElementConstructor
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      if (window.customElements === undefined)
        throw new Error("Custom elements are not supported in this browser");

      if (customElements.get(tagName)) return;
      customElements.define(tagName, createElementClass());

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
