export { default } from "./main.mjs";
export const config = {
  name: "server handler",
  generator: "nitro@3.0.1-20260731-205209-52abde8a",
  path: "/*",
  nodeBundler: "none",
  includedFiles: ["**"],
  excludedPath: ["/.netlify/*"],
  preferStatic: true,
};