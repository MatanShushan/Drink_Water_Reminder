document.addEventListener(
  "DOMContentLoaded",
  () => {
    const checkbox = document.getElementById("checkbox");
    const saveBtn = document.getElementById("saveBtn");

    const Second = 1000 * 1;
    const Minute = 1000 * 60;
    const Hour = 1000 * 60 * 60;
    let currentTimeAmount;
    let currentTimeUnit;

    function getCurrentTimeUnit(timeUnitStr) {
      switch (timeUnitStr) {
        case "Seconds":
          currentTimeUnit = Second;
          return;
        case "Minutes":
          currentTimeUnit = Minute;
          return;
        case "Hours":
          currentTimeUnit = Hour;
          return;
      }
    }

    function sendToExtensions() {
      chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "updateTime",
          currentTimeAmount,
          currentTimeUnit
        });
      });
    }

    function getCurrentState() {
      chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getData" }, {}, res => {
            if (res.isActive) {
                checkbox.checked = res.isActive;
            }
          if (res.currentTimeAmount) {
            document.getElementById("timeAmount").value = Number(
              res.currentTimeAmount
            );
            if (res.currentTimeUnit) {
              setCurrentTimeUnit(res.currentTimeUnit);
            }
          }
        });
      });
    }

    function setCurrentTimeUnit(time) {
      const e = document.getElementById("timeUnit");

      switch (time) {
        case Second:
          e.value = "Seconds";
          break;
        case Minute:
          e.value = "Minutes";
          break;
        case Hour:
          e.value = "Hours";
          break;
      }
    }

    checkbox.addEventListener("change", () => {
      chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "onSwitch",
          isActive: checkbox.checked
        });
      });
    });

    saveBtn.addEventListener("click", () => {
      currentTimeAmount = Number(document.getElementById("timeAmount").value);
      const e = document.getElementById("timeUnit");
      const timeStr = e.options[e.selectedIndex].value;
      getCurrentTimeUnit(timeStr);
      sendToExtensions();
    });

    getCurrentState();
  },
  false
);
