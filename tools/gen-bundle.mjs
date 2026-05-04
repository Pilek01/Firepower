import fs from "node:fs";

const core = fs.readFileSync("src/simulator-core.js", "utf8")
  .replace(/export const /g, "const ")
  .replace(/export function /g, "function ");

const profileStorage = fs.readFileSync("src/profile-storage.js", "utf8")
  .replace(/export const /g, "const ")
  .replace(/export function /g, "function ");

const app = fs.readFileSync("src/app.js", "utf8")
  .replace(
    /import\s*\{[\s\S]*?\}\s*from "\.\/simulator-core\.js";\s*/,
    "const { SHIPS, DEFAULT_MODIFIERS, compareFleets, parseBattleReportJson, parseFleetText, parseScanJson, runMonteCarlo } = window.FirepowerCore;\n\n",
  )
  .replace(
    /import\s*\{ clearPlayerProfile, loadPlayerProfile, savePlayerProfile \}\s*from "\.\/profile-storage\.js";\s*/,
    "",
  );

const bundle = `/* Generated from simulator-core.js and app.js so index.html works from file:// */
(function(){
${core}
window.FirepowerCore = { SHIPS, DEFAULT_MODIFIERS, compareFleets, parseBattleReportJson, parseFleetText, parseScanJson, runMonteCarlo };
})();

${profileStorage}

${app}`;

fs.writeFileSync("src/browser-bundle.js", bundle);
console.log("wrote src/browser-bundle.js");
