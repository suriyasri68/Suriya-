let habits = JSON.parse(localStorage.getItem("habits")) || [];
let completedDays = JSON.parse(localStorage.getItem("completedDays")) || {};

function addHabit() {
  let habitInput = document.getElementById("habitInput");
  let habit = habitInput.value;

  if (habit === "") return alert("Enter a habit!");

  habits.push(habit);
  habitInput.value = "";

  saveData();
  displayHabits();
}

function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("completedDays", JSON.stringify(completedDays));
}

function displayHabits() {
  let habitList = document.getElementById("habitList");
  habitList.innerHTML = "";

  habits.forEach((habit, index) => {
    let streak = calculateStreak(habit);

    habitList.innerHTML += `
      <div class="habit">
        <strong>${habit}</strong><br>
        🔥 Streak: ${streak} days <br>
        <button onclick="deleteHabit(${index})">Delete</button>
      </div>
    `;
  });

  renderCalendar();
  updateChart();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  saveData();
  displayHabits();
}

function renderCalendar() {
  let calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  let today = new Date();
  let daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    let dateKey = today.getMonth() + "-" + i;

    let div = document.createElement("div");
    div.className = "calendar-day";
    div.innerText = i;

    if (completedDays[dateKey]) {
      div.classList.add("completed");
    }

    div.onclick = () => toggleDay(dateKey);
    calendar.appendChild(div);
  }
}

function toggleDay(dateKey) {
  completedDays[dateKey] = !completedDays[dateKey];
  saveData();
  displayHabits();
}

function calculateStreak(habit) {
  let streak = 0;
  let today = new Date();

  for (let i = 0; i < 30; i++) {
    let date = new Date();
    date.setDate(today.getDate() - i);
    let key = date.getMonth() + "-" + date.getDate();

    if (completedDays[key]) streak++;
    else break;
  }

  return streak;
}

function updateChart() {
  let completedCount = Object.values(completedDays).filter(v => v).length;
  let remaining = 30 - completedCount;

  let ctx = document.getElementById('progressChart').getContext('2d');

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        data: [completedCount, remaining],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    }
  });
}

displayHabits();
