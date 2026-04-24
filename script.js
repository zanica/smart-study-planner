const completeSound = new Audio("sounds/complete.mp3");
const deleteSound = new Audio("sounds/delete.mp3");
const addSound = new Audio("sounds/add.mp3");

completeSound.volume = 0.5;
deleteSound.volume = 0.5;
addSound.volume = 0.5;

// ===============================
// ADD TASK (Form Handling)
// ===============================

const editId = localStorage.getItem("editTaskId");

const form = document.getElementById("taskForm");

if(form){
form.addEventListener("submit", function(e){

e.preventDefault();

let title = document.getElementById("title").value;
let description = document.getElementById("description").value;
let dueDate = document.getElementById("dueDate").value;
let priority = document.getElementById("priority").value;

let task = {
id: Date.now(),
title,
description,
dueDate,
priority,
completed: false
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
if(editId){

tasks = tasks.map(t => {
if(t.id == editId){
return {
...t,
title,
description,
dueDate,
priority
};
}
return t;
});

localStorage.removeItem("editTaskId");

alert("Task Updated!");

} else {

tasks.push(task);
alert("Task Added!");

}

localStorage.setItem("tasks", JSON.stringify(tasks));

addSound.play(); //sound

form.reset();

});
}

if(editId && form){

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let taskToEdit = tasks.find(t => t.id == editId);

if(taskToEdit){
document.getElementById("title").value = taskToEdit.title;
document.getElementById("description").value = taskToEdit.description;
document.getElementById("dueDate").value = taskToEdit.dueDate;
document.getElementById("priority").value = taskToEdit.priority;
}

}

// ===============================
// UPDATE PROGRESS BAR
// ===============================

function updateProgress(){

const progress = document.getElementById("progress");
if(!progress) return;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let completed = tasks.filter(task => task.completed).length;
let percent = tasks.length ? (completed / tasks.length) * 100 : 0;

progress.style.width = percent + "%";
progress.textContent = Math.round(percent) + "%";

}


// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks(){

const taskList = document.getElementById("taskList");
if(!taskList) return;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

taskList.innerHTML = "";

tasks.forEach(task => {

let div = document.createElement("div");
div.classList.add("task-card");

// Countdown
let timeText = getTimeRemaining(task.dueDate);

// Overdue styling
if(timeText.includes("Overdue")){
div.classList.add("overdue");
}

// Completed styling
if(task.completed){
div.classList.add("completed");
}

div.innerHTML = `
<h3>${task.title}</h3>
<p>${task.description}</p>
<p>Due: ${task.dueDate}</p>
<p class="countdown">${timeText}</p>

<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>

<br>

<button onclick="completeTask(${task.id})">✔ Complete</button>
<button onclick="editTask(${task.id})">✏️ Edit</button>
<button onclick="deleteTask(${task.id})">🗑 Delete</button>
`;

taskList.appendChild(div);

});

updateProgress();
}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id){

  deleteSound.play(); // sound

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks = tasks.filter(task => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();
  updateProgress();

}


// ===============================
// COMPLETE TASK
// ===============================

function completeTask(id){

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

tasks = tasks.map(task => {
 if(task.id === id){
    if(task.completed === false){
      celebrate(); // trigger only when marking complete
      updateStreak(); // update streak
      completeSound.play(); // sound
    } 

  task.completed = !task.completed;
  }
 return task;
});

localStorage.setItem("tasks", JSON.stringify(tasks));

displayTasks();
updateProgress();
updatePoints();
updateLevel();

}


// ===============================
// FILTER TASKS
// ===============================

function filterTasks(){

let filterElement = document.getElementById("filter");
if(!filterElement) return;

let filter = filterElement.value;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let filtered = tasks;

if(filter === "completed"){
filtered = tasks.filter(t => t.completed);
}else if(filter !== "all"){
filtered = tasks.filter(t => t.priority.toLowerCase() === filter);
}

displayFilteredTasks(filtered);
}


// ===============================
// DISPLAY FILTERED TASKS
// ===============================

function displayFilteredTasks(list){

const taskList = document.getElementById("taskList");
if(!taskList) return;

taskList.innerHTML = "";

list.forEach(task => {

let div = document.createElement("div");
div.classList.add("task-card");

let timeText = getTimeRemaining(task.dueDate);

if(timeText.includes("Overdue")){
div.classList.add("overdue");
}

if(task.completed){
div.classList.add("completed");
}

div.innerHTML = `
<h3>${task.title}</h3>
<p>${task.description}</p>
<p>Due: ${task.dueDate}</p>
<p class="countdown">${timeText}</p>

<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>

<br>

<button onclick="completeTask(${task.id})">✔ Complete</button>
<button onclick="editTask(${task.id})">✏️ Edit</button>
<button onclick="deleteTask(${task.id})">🗑 Delete</button>
`;

taskList.appendChild(div);

});

}

// ===============================
// COUNTDOWN TIMER
// ===============================

function getTimeRemaining(dueDate){

let now = new Date();
let due = new Date(dueDate);

let diff = due - now;

if(diff <= 0){
return "⚠️ Overdue";
}

let days = Math.floor(diff / (1000 * 60 * 60 * 24));
let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

return `${days}d ${hours}h remaining`;

}


// ===============================
// AUTO UPDATE COUNTDOWN
// ===============================

setInterval(() => {
displayTasks();
}, 60000); // every minute


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  displayTasks();
  updateProgress();
  updatePoints();
  updateLevel();

// load streak value
 let streakDisplay = document.getElementById("streak");
 if(streakDisplay){
    streakDisplay.textContent = (localStorage.getItem("streak") || 0) + " 🔥";
  }
});


// ===============================
// EDIT TASK
// ===============================

function editTask(id){
 localStorage.setItem("editTaskId", id);
 window.location.href = "add-task.html";
}

// ===============================
// UPDATE POINTS
// ===============================

function updatePoints(){

 let pointsDisplay = document.getElementById("points");
 if(!pointsDisplay) return;

 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

 let points = tasks.filter(t => t.completed).length * 10;

 pointsDisplay.textContent = points + " pts";

 localStorage.setItem("points", points);

}

// ===============================
// LEVEL UPDATE 
// ===============================

function updateLevel(){

 let levelDisplay = document.getElementById("level");
 if(!levelDisplay) return;

 let points = parseInt(localStorage.getItem("points")) || 0;

 let level = "Beginner";

 if(points >= 100) level = "Intermediate";
 if(points >= 200) level = "Advanced";
 if(points >= 300) level = "Expert";

 levelDisplay.textContent = level;

}

// ===============================
// CELEBRATE FUNCTION
// ===============================

function celebrate(){

for(let i = 0; i < 50; i++){

let confetti = document.createElement("div");

confetti.classList.add("confetti");

confetti.style.left = Math.random() * 100 + "vw";
confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";

document.body.appendChild(confetti);

// remove after animation
setTimeout(() => {
 confetti.remove();
}, 3000);

}

}

// ===============================
// UPDATE STREAK
// ===============================

function updateStreak(){

let today = new Date().toDateString();

let lastDate = localStorage.getItem("lastCompletedDate");
let streak = parseInt(localStorage.getItem("streak")) || 0;

if(lastDate === today){
return; // already counted today
}

let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

if(lastDate === yesterday.toDateString()){
streak += 1;
}else{
streak = 1;
}

localStorage.setItem("streak", streak);
localStorage.setItem("lastCompletedDate", today);

// update UI immediately
let streakDisplay = document.getElementById("streak");
if(streakDisplay){
streakDisplay.textContent = streak + " 🔥";
}

}