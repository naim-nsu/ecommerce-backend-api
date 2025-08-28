import { createRequire } from "module";
import { pathsToModuleNameMapper } from "ts-jest";

const require = createRequire(import.meta.url);
const { compilerOptions } = require("./tsconfig.json");

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./tests"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
