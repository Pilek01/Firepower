import fs from "node:fs";

const core = fs.readFileSync("src/simulator-core.js", "utf8")
  .replace(/export const /g, "const ")
  .replace(/export function /g, "function ");

const app = fs.readFileSync("src/app.js", "utf8")
  .replace(
    /^import[\s\S]*?from "\.\/simulator-core\.js";\r?\n\r?\n/,
    "const { SHIPS, DEFAULT_MODIFIERS, compareFleets, parseBattleReportJson, parseFleetText, parseScanJson, runMonteCarlo } = window.FirepowerCore;\n\n",
  );

const bundle = `/* Generated from simulator-core.js and app.js so index.html works from file:// */
(function(){
${core}
window.FirepowerCore = { SHIPS, DEFAULT_MODIFIERS, compareFleets, parseBattleReportJson, parseFleetText, parseScanJson, runMonteCarlo };
})();

${app}`;

fs.writeFileSync("src/browser-bundle.js", bundle);
console.log("wrote src/browser-bundle.js");
