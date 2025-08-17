let currentAlarmSound = null;
let remindTaskText = '';
let remindDelay = 5 * 60 * 1000; // 5 minutes
let currentTimeout = null;

// Ask permission for browser notifications when the page loads
document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  changeBackground(); // Initial background
  setInterval(changeBackground, 8000); // Start background slideshow
});

function addTask() {
  const taskText = document.getElementById("task").value;
  const alarmTime = document.getElementById("alarmTime").value;

  if (!taskText || !alarmTime) {
    alert("Please enter both task and time!");
    return;
  }

  const li = document.createElement("li");
  const now = new Date();
  const alarm = new Date(now.toDateString() + " " + alarmTime);

  li.innerHTML = `
    <span>${taskText}<br><small>Alarm: ${alarmTime}</small></span>
    <input type="checkbox" onchange="toggleDone(this)" />
    <button onclick="removeTask(this)">❌</button>
  `;

  document.getElementById("taskList").appendChild(li);

  const timeout = alarm.getTime() - now.getTime();
  if (timeout > 0) {
    currentTimeout = setTimeout(() => {
      triggerAlarm(taskText);
    }, timeout);
  }

  document.getElementById("task").value = "";
  document.getElementById("alarmTime").value = "";
}

function triggerAlarm(taskText) {
  currentAlarmSound = document.getElementById("alarmSound");
  currentAlarmSound.play();

  remindTaskText = taskText;

  document.getElementById("alarmMessage").innerText = "🔔 Reminder: " + taskText;
  document.getElementById("alarmModal").style.display = "block";

  // Browser notification
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Reminder", {
      body: taskText,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png"
    });
  }
}

function stopAlarm() {
  if (currentAlarmSound) {
    currentAlarmSound.pause();
    currentAlarmSound.currentTime = 0;
  }
  document.getElementById("alarmModal").style.display = "none";
}

function remindLater() {
  stopAlarm();
  currentTimeout = setTimeout(() => {
    triggerAlarm(remindTaskText);
  }, remindDelay);
}

function dismissAlarm() {
  stopAlarm();
  clearTimeout(currentTimeout);
}

function removeTask(button) {
  button.parentElement.remove();
}

function toggleDone(checkbox) {
  const span = checkbox.parentElement.querySelector("span");
  if (checkbox.checked) {
    span.innerHTML = "✅ " + span.innerHTML;
    span.style.textDecoration = "line-through";
  } else {
    span.innerHTML = span.innerHTML.replace("✅ ", "");
    span.style.textDecoration = "none";
  }
}

// 🌄 Changing nature background wallpaper
const natureImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1503264116251-35a269479413",
  "https://images.unsplash.com/photo-1493244040629-496f6d136cc3",
  "https://images.unsplash.com/photo-1610878180933-045ba61b5433"
];

let currentBg = 0;

function changeBackground() {
  document.body.style.backgroundImage = `url('${natureImages[currentBg]}')`;
  currentBg = (currentBg + 1) % natureImages.length;
}
