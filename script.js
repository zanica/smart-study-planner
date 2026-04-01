let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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
completed:false
};

tasks.push(task);

localStorage.setItem("tasks", JSON.stringify(tasks));

alert("Task Added!");

form.reset();

});
}

function displayTasks(){

let taskList = document.getElementById("taskList");

if(!taskList) return;

taskList.innerHTML="";

tasks.forEach(task => {

let div = document.createElement("div");
div.classList.add("task-card");

if(task.completed) div.classList.add("completed");

div.innerHTML = `
<h3>${task.title}</h3>
<p>${task.description}</p>
<p>Due: ${task.dueDate}</p>
<p>Priority: ${task.priority}</p>

<button onclick="completeTask(${task.id})">Complete</button>
<button onclick="deleteTask(${task.id})">Delete</button>
`;

taskList.appendChild(div);

});

updateProgress();

let timeText = getTimeRemaining(task.dueDate);

if(timeText.includes("Overdue")){
div.classList.add("overdue");
}

}

div.innerHTML = `
<h3>${task.title}</h3>
<p>${task.description}</p>
<p>Due: ${task.dueDate}</p>

<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>

<br>

<button onclick="completeTask(${task.id})">✔ Complete</button>
<button onclick="deleteTask(${task.id})">🗑 Delete</button>
`;

function deleteTask(id){

tasks = tasks.filter(task => task.id !== id);

localStorage.setItem("tasks", JSON.stringify(tasks));

displayTasks();

}

function completeTask(id){

tasks = tasks.map(task => {

if(task.id === id){
task.completed = !task.completed;
}

return task;

});

localStorage.setItem("tasks", JSON.stringify(tasks));

displayTasks();

}

function updateProgress(){

let progress = document.getElementById("progress");

if(!progress) return;

let completed = tasks.filter(task => task.completed).length;

let percent = tasks.length ? (completed/tasks.length)*100 : 0;

progress.style.width = percent + "%";

}

displayTasks();
updateProgress();

function filterTasks(){

let filter = document.getElementById("filter").value;

let filtered = tasks;

if(filter === "completed"){
filtered = tasks.filter(t => t.completed);
}else if(filter !== "all"){
filtered = tasks.filter(t => t.priority.toLowerCase() === filter);
}

displayFilteredTasks(filtered);
}

function displayFilteredTasks(list){

let taskList = document.getElementById("taskList");

taskList.innerHTML = "";

list.forEach(task => {

let div = document.createElement("div");
div.classList.add("task-card");

if(task.completed) div.classList.add("completed");

div.innerHTML = `
<h3>${task.title}</h3>
<p>${task.description}</p>
<p>Due: ${task.dueDate}</p>
<p class="countdown">${getTimeRemaining(task.dueDate)}</p>

<span class="priority ${task.priority.toLowerCase()}">
${task.priority}
</span>

<br>

<button onclick="completeTask(${task.id})">✔ Complete</button>
<button onclick="deleteTask(${task.id})">🗑 Delete</button>
`;

taskList.appendChild(div);

});
}
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
//ensures countdown stays  accurate
setInterval(() => { 
displayTasks();
}, 60000); // updates every minute