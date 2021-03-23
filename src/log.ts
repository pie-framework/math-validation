export const logger = (name: string) => {
  if (process.env.NODE_ENV === "test") {
    const debug = require("debug");
    return debug(name);
  } else {
    return () => {};
  }
};
