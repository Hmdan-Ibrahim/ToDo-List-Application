let inputTask = document.querySelector(".input-section input")
let headTitle = document.querySelector(".container h2")
let addBTN = document.querySelector(".input-section button")
let tasksList = document.querySelector(".tasks-list")
let ComletedTask = document.getElementById("comleted")
let numOfTasks = document.getElementById("numOfTasks")

let arrOfTasks = []
let handleUpdateVal;
if (localStorage.todoList) {
  arrOfTasks = getTasksFromLS()
  displayIetms(arrOfTasks)
}

onload = function () {
  inputTask.focus()
}

checkFoundTask()

addBTN.onclick = function (event) {
  if (inputTask.value != '') {
    tasksList.innerHTML = ''
    if (this.innerHTML == "Add Task") {
      addItem(inputTask.value)
    } else {
      updateTaskName(handleUpdateVal, inputTask.value)
      this.innerHTML = "Add Task"
    }
    inputTask.value = ''
  }
  event.preventDefault()
}

let overlay = document.querySelector(".overlay")
let popupDel = document.querySelector(".popup-delete")


document.addEventListener("click", function (element) {
  if (element.target.innerHTML == "delete") {
    overlay.style.display = "block";
    popupDel.style.display = "block";
    popupDel.style.top = `calc(190px + ${scrollY}px)`

    document.getElementById("D-yes").onclick = function () {
      deleteTask(element.target.parentElement.id)
      popupDel.style.display = "none";
      element.target.parentElement.remove()
      overlay.style.display = "none";
      numberOfTasksFun()
    }
  }

  else if (element.target.innerHTML == "update") {
    inputTask.focus()
    addBTN.innerHTML = "Update Task"
    handleUpdateVal = arrOfTasks[element.target.parentElement.id].name
    inputTask.value = handleUpdateVal
  }

  else if (element.target.title == "isComplete") {
    changeStatusTask(element.target.parentElement.id)
    numberOfComletedTasks()
    element.target.parentElement.classList.toggle("comleted")
  }

  checkFoundTask()
})

function getTasksFromLS() {
  return JSON.parse(localStorage.todoList)
}

function checkFoundTask() {
  let clearAllBTN = document.getElementById('clearAll')
  clearAllBTN.style.display = arrOfTasks.length > 0 ? 'block' : 'none';

  headTitle.innerHTML = arrOfTasks.length > 0 ? "Tasks" : "Not Found Tasks"
}

function displayIetms(arrOfTasks) {
  let indexTask = 0
  tasksList.innerHTML = ''

  arrOfTasks.forEach(element => {
    const { name: Name, date: Date, finishTask: TaskDone } = element
    let taskItem = document.createElement('div')
    taskItem.className = `task ${TaskDone ? "comleted" : ''}`
    taskItem.id = indexTask

    taskItem.innerHTML += `
        <input type="checkbox" ${TaskDone ? 'checked' : ''} name="task${indexTask + 1}" title="isComplete"/>
            <div class="text">
                <h3>${Name}</h3>
                <p id="date">${Date}</p>
            </div>
            <button class="delete">delete</button>
            <button class="update">update</button>
        `;

    tasksList.appendChild(taskItem)
    indexTask++
  })
  numberOfComletedTasks()
  numberOfTasksFun()
}

function addItem(taskItem) {
  let notFountTask = true

  arrOfTasks.forEach(element => {
    if (element.name == taskItem) notFountTask = false
  });

  if (notFountTask) {
    let dateToday = new Date()
    let task = {
      name: taskItem,
      date: `${dateToday.getDate()}/${dateToday.getMonth() + 1}/${dateToday.getFullYear()}`,
      finishTask: false
    }

    arrOfTasks.push(task)
    addDataToLS(arrOfTasks)
  }
  displayIetms(arrOfTasks)
}

function addDataToLS(Tasks) {
  localStorage.setItem("todoList", JSON.stringify(Tasks))
}

function updateTaskName(oldTaskName, newTaskName) {
  for (let element of arrOfTasks) {
    if (element.name == oldTaskName) {
      element.name = newTaskName
      break
    }
  }
  addDataToLS(arrOfTasks)
  displayIetms(arrOfTasks)
}

function deleteTask(indexTask) {
  arrOfTasks.splice(+indexTask, 1)
  addDataToLS(arrOfTasks)
}

function changeStatusTask(indexTask) {
  arrOfTasks[indexTask].finishTask = !arrOfTasks[indexTask].finishTask
  addDataToLS(arrOfTasks)
}

function numberOfTasksFun() {
  numOfTasks.setAttribute("number", `${arrOfTasks.length}`)
}

function numberOfComletedTasks() {
  let finishedTasksNum = arrOfTasks.reduce((counter, currentVal) => currentVal.finishTask ? counter += 1 : counter, 0)
  ComletedTask.setAttribute("number", `${finishedTasksNum}`)
}

function clearAllTask() {
  tasksList.innerHTML = ''
  arrOfTasks = []
  localStorage.clear()
  ComletedTask.setAttribute("number", 0)
  numOfTasks.setAttribute("number", 0)
}