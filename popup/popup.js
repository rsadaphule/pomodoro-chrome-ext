const btnAddTask = document.getElementById("btn-add-task");
const btnStartTimer = document.getElementById("btn-start-timer");
const btnStopTimer = document.getElementById("btn-stop-timer");
const btnResetTimer = document.getElementById("btn-reset-timer");

const taskContainer = document.getElementById("task-container");

btnStartTimer.addEventListener("click", () => {
  chrome.storage.local.set({
    isRunning: true,
  });
});

btnStopTimer.addEventListener("click", () => {
  chrome.storage.local.set({
    isRunning: false,
  });
});

setInterval(updateTimerText, 1000);

function updateTimerText() {
  console.log("inside updateTimerText");
  let timer = 0;
  let isRunning = false;
  chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
    timer = res.timer;
    isRunning = res.isRunning;
    console.log(res.timeOption);
    timeOption = res.timeOption ? res.timeOption : 25;
    console.log(isRunning);
    console.log(timeOption);
    if (!isRunning) return;
    let minutes = timeOption - Math.ceil(timer / 60);
    let seconds = 0;
    if (timer % 60 != 0) {
      seconds = 60 - (timer % 60);
    }

    minutesInString = minutes.toString().padStart(2, "0");
    secondsInString = seconds.toString().padStart(2, "0");

    let timerText = `${minutesInString}:${secondsInString}`;
    console.log(timerText);
    document.getElementById("timerElement").textContent = timerText;
  });
}

btnResetTimer.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
  });
  updateTimerText();
});

let tasks = [];

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks: tasks,
  });
}

btnAddTask.addEventListener("click", () => {
  addTask();
});

function addTask(taskNum) {
  taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum);
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskContainer.textContent = "";
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
}

function renderTask(taskNum) {
  div = document.createElement("div");
  text = document.createElement("input");
  text.type = "text";
  text.value = tasks[taskNum];
  text.placeholder = "Enter a Task";
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  btnDelete = document.createElement("input");
  btnDelete.type = "button";
  btnDelete.value = "X";
  btnDelete.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  div.appendChild(text);
  div.appendChild(btnDelete);
  taskContainer.appendChild(div);
}
