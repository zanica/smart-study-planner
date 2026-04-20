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

alert("Task Added!");

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
task.completed = !task.completed;
}
return task;
});

localStorage.setItem("tasks", JSON.stringify(tasks));

displayTasks();
updateProgress();

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
// EDIT TASK
// ===============================

function editTask(id){
localStorage.setItem("editTaskId", id);
window.location.href = "add-task.html";
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
});
