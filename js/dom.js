var tasks = JSON.parse(localStorage.getItem("domTasks")) || [];

function addTask() {
    let content = document.getElementsByClassName("add")[0].value;
    if (content.trim().length == 0) return;
    tasks.unshift(new task(Math.trunc(Math.random() * 1000000), content, false));
    document.getElementsByClassName("add")[0].value = null;
    store();
    list();
}

function deleteTask(id) {
    tasks.splice(tasks.findIndex(task => task.id == id), 1);
    store();
    list();
}

function deleteCompleted() {
    tasks = tasks.filter(task => task.achieve == false);
    store();
    list();
}

function updateAchieve(id) {
    let index = tasks.findIndex(task => task.id == id);
    let t = tasks[index];
    t.achieve = !t.achieve;
    tasks.splice(index, 1);
    tasks.unshift(t);
    store();
    list();
}

function updateContent(id) {
    let inputEl = event.currentTarget;
    if(id) {
        if(event.keyCode != 13) return;
        let index = tasks.findIndex(task => task.id == id);
        let t = tasks[index];
        t.content = inputEl.value;
        tasks.splice(index, 1);
        tasks.unshift(t);
        store();
        list();
    }
    inputEl.parentElement.classList.remove("editing");
}

function updateAll() {
    if (tasks.filter(task => task.achieve == true).length == tasks.length) tasks.forEach(task => task.achieve = !task.achieve);
    else tasks.forEach(task => task.achieve = true);
    store();
    list();
}

function showTask(id) {
    let itemEl = event.currentTarget.parentElement.parentElement;
    itemEl.classList.add("editing");
    let inputEl = itemEl.children[1];
    inputEl.value = tasks.find(task => task.id == id).content;
    inputEl.focus();
}

function switchState(state) {
    localStorage.setItem("domState", state);
    list();
}

function store() {
    localStorage.setItem("domTasks", JSON.stringify(tasks));
}

function list() {
    let state = 0;
    if(localStorage.getItem("domState")) state = localStorage.getItem("domState");
    else localStorage.setItem("domState", state);
    let tabBarEl = document.getElementsByClassName("tabBar")[0];
    let itemsEl = document.getElementsByClassName("items")[0];
    let checkboxEl = document.getElementsByClassName("checkbox")[0];
    if (tasks.findIndex(task => task.achieve == false) == -1) checkboxEl.classList.add("checked");
    else checkboxEl.classList.remove("checked");
    if (tasks.length == 0) {
        checkboxEl.classList.add("hide");
        tabBarEl.classList.remove("footer");
        tabBarEl.innerHTML = "";
    } else {
        checkboxEl.classList.remove("hide");
        tabBarEl.classList.add("footer");
        let items = tasks.filter(task => task.achieve == false).length;
        tabBarEl.innerHTML = `<span class="state">${items} ${items == 1 ? 'item' : 'items'} left</span>
        <ul class="filters">
            <li><a href="#/all" class="${state == 0 ? 'selected' : ''}" onclick="switchState(0)">All</a></li>
            <li><a href="#/active" class="${state == 1 ? 'selected' : ''}" onclick="switchState(1)">Active</a></li>
            <li><a href="#/completed" class="${state == 2 ? 'selected' : ''}" onclick="switchState(2)">Completed</a></li>
        </ul>
        <a class="clear-completed ${items < tasks.length ? '' : 'hide'}" onclick="deleteCompleted()">
            Clear completed
        </a>`;
    }
    itemsEl.innerHTML = "";
    let itemEL = "";
    let arr = [];
    if (state == 1) arr = tasks.filter(task => task.achieve == false);
    else if (state == 2) arr = tasks.filter(task => task.achieve == true);
    else arr = tasks;
    arr.forEach(task => {
        itemEL += `<div class="item">
        <div class="content">
            <div class="checkbox ${task.achieve == true ? 'checked' : ''}" onclick="updateAchieve(${task.id})">
                <svg viewBox="12 13 29 22" stroke="currentColor" stroke-width="2"
                    fill="none">
                    <polyline points="13.2427972 23.7361617 21.8111153 32.3044798 38 16.1155951"></polyline>
                </svg>
            </div>
            <div class="text" ondblclick="showTask(${task.id})" >${task.content}</div>
            <div class="remove" onclick="deleteTask(${task.id})">
                <svg viewBox="19 19 22 22" stroke-linecap="round" width="18" height="18"
                    stroke="currentColor" stroke-width="2">
                    <g transform="translate(21.000000, 21.000000)">
                        <path d="M0.333333333,0.333333333 L17.4148373,17.4148373"></path>
                        <path d="M0.333333333,0.333333333 L17.4148373,17.4148373"
                            transform="translate(9.000000, 9.000000) scale(-1, 1) translate(-9.000000, -9.000000)"></path>
                    </g>
                </svg>
            </div>
        </div>
        <input type="text" class="edit" onkeyup="updateContent(${task.id})" onblur="updateContent()">
    </div>`;
    })
    itemsEl.innerHTML = itemEL;
}

function task(id, content, achieve) {
    this.id = id;
    this.content = content;
    this.achieve = achieve;
}