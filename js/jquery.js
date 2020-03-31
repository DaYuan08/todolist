var tasks = JSON.parse(localStorage.getItem("jqueryTasks")) || [];

function monitor() {
    $(".add").keyup(addTask);
    $(".clear-completed").click(deleteCompleted);
    $(".checkbox").click(updateAll);
    $("#all").click(switchState);
    $("#active").click(switchState);
    $("#completed").click(switchState);
    list();
}

function store() {
    localStorage.setItem("jqueryTasks", JSON.stringify(tasks));
}

function addTask() {
    if (event.keyCode != 13) return;
    let content = $(".add").val();
    if (content.trim().length == 0) return;
    tasks.unshift(new task(Math.trunc(Math.random() * 1000000), content, false));
    $(".add").val("");
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
    let task = tasks[index];
    task.achieve = !task.achieve;
    tasks.splice(index, 1);
    tasks.unshift(task);
    store();
    list();
}

function updateContent(id) {
    event.stopImmediatePropagation();
    let inputEl = $(event.target);
    if (event.keyCode != 13) return;
    let index = tasks.findIndex(task => task.id == id);
    let task = tasks[index];
    task.content = inputEl.val();
    tasks.splice(index, 1);
    tasks.unshift(task);
    store();
    list();
    inputEl.parent().removeClass("editing");
}

function updateAll() {
    if (tasks.filter(task => task.achieve == true).length == tasks.length) tasks.forEach(task => task.achieve = !task.achieve);
    else tasks.forEach(task => task.achieve = true);
    store();
    list();
}

function showTask() {
    let itemEl = $(event.target).parent().parent();
    itemEl.addClass("editing");
    let task = itemEl.children("input").val();
    itemEl.children("input").val("").focus().val(task);
}

function switchState() {
    $("#all").removeClass("selected");
    $("#active").removeClass("selected");
    $("#completed").removeClass("selected");
    $(event.target).addClass("selected");
    localStorage.setItem("jqueryState", event.target.id);
    list();
}

function list() {
    let list = [];
    let itemEl = "";
    let state = "all";
    let undone = tasks.filter(task => task.achieve == false).length;
    if (tasks.length == 0) {
        $(".footer").addClass("footer-hide");
        $(".checkbox").addClass("hide");
    } else {
        $(".footer").removeClass("footer-hide");
        $(".checkbox").removeClass("hide");
    }
    if (undone == 0) $(".checkbox").addClass("checked");
    else $(".checkbox").removeClass("checked");
    if (undone < tasks.length) $(".clear-completed").removeClass("hide");
    else $(".clear-completed").addClass("hide");
    if(localStorage.getItem("jqueryState")) state = localStorage.getItem("jqueryState");
    else localStorage.setItem("jqueryState", state);
    $(".state").text(undone + " " + (undone == 1 ? 'item ' : 'items ') + "left");
    if (state == "active") {
        list = tasks.filter(task => task.achieve == false);
        $("#active").addClass("selected");
    } else if (state == "completed") {
        list = tasks.filter(task => task.achieve == true);
        $("#completed").addClass("selected");
    }else {
        list = tasks;
        $("#all").addClass("selected");
    }
    list.forEach(task => {
        itemEl += `<div class="item">
        <div class="content">
            <div class="checkbox ${task.achieve == true ? 'checked' : ''}" onclick="updateAchieve(${task.id})">
                <svg viewBox="12 13 29 22" stroke="currentColor" stroke-width="2"
                    fill="none">
                    <polyline points="13.2427972 23.7361617 21.8111153 32.3044798 38 16.1155951"></polyline>
                </svg>
            </div>
            <div class="text" ondblclick="showTask()">${task.content}</div>
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
        <input type="text" class="edit" value="${task.content}" onkeyup="updateContent(${task.id})">
    </div>`;
    });
    $(".items").html(itemEl);
    $(".edit").on("blur", function () {
        $(event.target).parent().removeClass("editing");
    })
}

function task(id, content, achieve) {
    this.id = id;
    this.content = content;
    this.achieve = achieve;
}