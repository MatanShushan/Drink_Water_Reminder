let currentTimeAmount;
let currentTimeUnit;
let interval;
let isOn = false;

function start() {
  if (isOn && currentTimeAmount && currentTimeUnit) {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      alert("Drink");
    }, currentTimeAmount * currentTimeUnit);
  }
}
function handleMessage(req) {
  switch (req.type) {
    case "onSwitch":
      handleOnSwitch(req);
      break;
    case "updateTime":
      handleUpdateTime(req);
      break;
  }
}

function handleUpdateTime(req) {
  if (req.currentTimeAmount && req.currentTimeUnit) {
    currentTimeAmount = req.currentTimeAmount;
    currentTimeUnit = req.currentTimeUnit;
  }
  if (isOn) {
    start();
  }
}

function handleOnSwitch(req) {
  isOn = req.isActive;
  if (isOn) {
    start();
    return;
  }
  clearInterval(interval);
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "getData") {
    sendResponse({
      isActive: isOn,
      currentTimeAmount: currentTimeAmount,
      currentTimeUnit: currentTimeUnit
    });
    return;
  }
  handleMessage(req);
});
