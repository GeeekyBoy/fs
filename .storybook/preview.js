import "../src/index.scss";
import "simplebar/dist/simplebar.min.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /(Date|createdAt)$/i,
    },
  },
  layout: "fullscreen",
};
