const timeOption = document.getElementById("time-option");
timeOption.addEventListener("change", (event) => {
  const val = event.target.value;
  if (val > 60 || val < 1) {
    timeOption.value = 25;
  }
  //console.log(timeOption.value);
});

const saveBtn = document.getElementById("save-btn");

saveBtn.addEventListener("click", () => {
  const val = timeOption.value;

  console.log(val);
  chrome.storage.local.set({
    timeOption: val,
    timer: 0,
    isRunning: false,
  });
});
