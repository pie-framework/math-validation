export const logger = (name: string) => {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
    const debug = require("debug");
    return debug(name);
  } else {
    return () => {};
  }
};
