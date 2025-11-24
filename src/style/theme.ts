// src/style/theme.ts
export type ThemeName = "light" | "dark";

export const light = {
  name: "light",
  colors: {
    primary: "brown",
    background: "lightgray",
    secondary: "beige",
    third: "white",
  },
};

export const dark = {
  name: "dark",
  colors: {
    primary: "coral",
    background: "midnightblue",
    secondary: "darkslateblue",
    third: "slategray",
  },
};

export const themes = {
  light,
  dark,
};

export type ThemeType = typeof light;