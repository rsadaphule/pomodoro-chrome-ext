chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.local.set({
    shows: [],
  });

  chrome.contextMenus.create({
    title: "Search TV Show",
    id: "contextMenu1",
    contexts: ["page", "selection"],
  });

  chrome.contextMenus.create({
    title: "Read This Text",
    id: "contextMenu2",
    contexts: ["page", "selection"],
  });

  chrome.contextMenus.onClicked.addListener((event) => {
    if (event.menuItemId === "contextMenu1") {
      console.log(
        `http://api.tvmaze.com/search/shows?q=${event.selectionText}`
      );
      fetch(`http://api.tvmaze.com/search/shows?q=${event.selectionText}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          chrome.storage.local.set({ shows: data });
        });
    } else if (event.menuItemId === "contextMenu2") {
      console.log(event.selectionText);
      chrome.tts.speak(event.selectionText, { lang: "mr-IN" });
    }
  });
});

chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1 / 60,
});

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    timeOption: "timeOption" in res ? res.timeOption : 25,
    isRunning: "isRunning" in res ? res.isRunning : false,
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        let isRunning = res.isRunning;
        if (timer === 60 * res.timeOption) {
          this.registration.showNotification("Pomodoro timer", {
            body: `${res.timeOption} minutes timer is up`,
            icon: "icon.png",
          });
          timer = 0;
          isRunning = false;
        }
        console.log(timer);
        chrome.storage.local.set({
          timer: timer,
          isRunning: isRunning,
        });
      }
    });
  }
});
