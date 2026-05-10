// ==UserScript==
// @name         Sea of Sails -> FIREPOWER
// @namespace    firepower
// @version      0.3.1
// @match        https://seaofsails.com/*
// @match        https://www.seaofsails.com/*
// @match        https://pilek01.github.io/Firepower/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  const FIREPOWER_URL = "https://pilek01.github.io/Firepower/";
  const FIREPOWER_TARGET = "firepower";
  const SCAN_KEY = "firepower_scan";
  const ATTACKER_FLEET_KEY = "firepower_attacker_fleet";

  const isFirepower = location.href.startsWith(FIREPOWER_URL);

  if (isFirepower) {
    setupFirepowerReceiver();
    return;
  }

  addFirepowerButtons();

  function makeMessage(payload) {
    return JSON.stringify({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      payload,
    });
  }

  function readMessage(raw) {
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.payload ? parsed.payload : parsed;
  }

  function addFirepowerButtons() {
    setInterval(() => {
      addScanButtons();
      addFleetModalButton();
    }, 800);
  }

  function addScanButtons() {
    const copyButtons = document.querySelectorAll(".ssi-copy-btn");

    copyButtons.forEach((copyBtn) => {
      if (copyBtn.dataset.firepowerAdded === "1") return;

      const onclick = copyBtn.getAttribute("onclick") || "";
      const match = onclick.match(/copySectorScanJsonByIslandId\((\d+)\)/);
      if (!match) return;

      const islandId = Number(match[1]);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "🔥";
      btn.title = "Wyślij skan do FIREPOWER jako wróg";
      btn.className = "ssi-copy-btn";
      btn.style.marginLeft = "8px";
      btn.addEventListener("click", () => sendScanToFirepower(islandId));

      copyBtn.insertAdjacentElement("afterend", btn);
      copyBtn.dataset.firepowerAdded = "1";
    });
  }

  function addFleetModalButton() {
    const maxAllButton = document.querySelector("#sf-ship-max-all");
    if (!maxAllButton || maxAllButton.dataset.firepowerFleetAdded === "1") return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "🔥";
    btn.title = "Wyślij wybraną flotę do FIREPOWER jako moja flota";
    btn.className = maxAllButton.className;
    btn.style.marginLeft = "8px";
    btn.style.minWidth = "40px";
    btn.addEventListener("click", sendSelectedFleetToFirepower);

    maxAllButton.insertAdjacentElement("afterend", btn);
    maxAllButton.dataset.firepowerFleetAdded = "1";
  }

  async function sendScanToFirepower(islandId) {
    const pageClipboard = unsafeWindow.navigator.clipboard;
    const originalWriteText = pageClipboard.writeText.bind(pageClipboard);
    let capturedText = "";

    pageClipboard.writeText = async function (text) {
      capturedText = String(text || "");
      return originalWriteText(text);
    };

    try {
      const copyFn = unsafeWindow.copySectorScanJsonByIslandId;
      if (typeof copyFn !== "function") {
        alert("FIREPOWER: gra nie udostępnia teraz funkcji kopiowania JSON skanu.");
        return;
      }

      const result = copyFn(islandId);
      if (result && typeof result.then === "function") await result;

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!capturedText) {
        alert("FIREPOWER: nie udało się przechwycić JSON skanu.");
        return;
      }

      const json = JSON.parse(capturedText);
      GM_setValue(SCAN_KEY, makeMessage(json));
      window.open(FIREPOWER_URL, FIREPOWER_TARGET);
    } catch (err) {
      console.error("FIREPOWER scan send error:", err);
      alert("FIREPOWER: błąd wysyłania skanu. Sprawdź konsolę.");
    } finally {
      pageClipboard.writeText = originalWriteText;
    }
  }

  function sendSelectedFleetToFirepower() {
    const fleet = readSelectedFleetFromModal();
    const total = Object.values(fleet).reduce((sum, count) => sum + count, 0);

    if (!total) {
      alert("FIREPOWER: najpierw wpisz albo wybierz statki w popupie ataku.");
      return;
    }

    GM_setValue(ATTACKER_FLEET_KEY, makeMessage({ scan: { fleet } }));

    // Nie otwieramy ani nie przeładowujemy FIREPOWER tutaj. Jeśli karta FIREPOWER
    // jest już otwarta po skanie, odbierze dane przez listener Tampermonkey.
    console.info("FIREPOWER: wysłano moją flotę", fleet);
  }

  function readSelectedFleetFromModal() {
    const fleet = {};
    document.querySelectorAll('input[id^="sf-fleet-"]').forEach((input) => {
      const key = input.id.replace("sf-fleet-", "");
      const count = Math.max(0, Math.floor(Number(input.value) || 0));
      if (count > 0) fleet[key] = count;
    });
    return fleet;
  }

  function setupFirepowerReceiver() {
    if (typeof GM_addValueChangeListener === "function") {
      GM_addValueChangeListener(SCAN_KEY, (_name, _oldValue, newValue) => {
        loadJsonIntoFirepower("defender", newValue, SCAN_KEY);
      });
      GM_addValueChangeListener(ATTACKER_FLEET_KEY, (_name, _oldValue, newValue) => {
        loadJsonIntoFirepower("attacker", newValue, ATTACKER_FLEET_KEY);
      });
    }

    loadPendingIntoFirepower();
  }

  function loadPendingIntoFirepower() {
    const scanRaw = GM_getValue(SCAN_KEY, "");
    const attackerRaw = GM_getValue(ATTACKER_FLEET_KEY, "");

    if (scanRaw) loadJsonIntoFirepower("defender", scanRaw, SCAN_KEY);
    if (attackerRaw) loadJsonIntoFirepower("attacker", attackerRaw, ATTACKER_FLEET_KEY);
  }

  function loadJsonIntoFirepower(side, raw, keyToDelete) {
    if (!raw) return;

    let json;
    try {
      json = readMessage(raw);
    } catch (err) {
      console.error("FIREPOWER: niepoprawny komunikat JSON", err);
      GM_deleteValue(keyToDelete);
      return;
    }

    const timer = setInterval(() => {
      const bridge = unsafeWindow.FirepowerBridge;
      if (!bridge) return;

      if (side === "attacker") bridge.load({ attackerJson: json });
      else bridge.load({ defenderJson: json });

      GM_deleteValue(keyToDelete);
      clearInterval(timer);
    }, 250);
  }
})();
