let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;
const deleteButton = document.querySelector('.delete-all');

window.onload = async () => {
  input = document.getElementById('add-task');
  input.addEventListener('change', updateValue);
  checkAllTasks();
  const resp = await fetch ('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
}

const onClickButton = async () => {
  const resp = await fetch ('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-type' : 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin' : '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    })
  });
  const result = await resp.json();
  allTasks.push(result.data);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  valueInput = '';
  input.value = '';
  checkAllTasks();
  render();
}

const updateValue = (event) => {
  valueInput = event.target.value;
}

const render = () => {
  const content = document.getElementById('content-page');
  while(content.firstChild) {
    content.removeChild(content.firstChild)
  }
  sortTasks();
  allTasks.map((item, index) => {
  const container = document.createElement('div');
  container.id = index;
  container.className = 'task-container';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const { text, isCheck } = item;

  checkbox.checked = isCheck;
  checkbox.onchange = () => {
    onChangeCheckbox(item._id, isCheck);
  }
  container.appendChild(checkbox);

  const words = document.createElement('p');
  words.innerText = text;
  words.className = isCheck ? 'text-task done-text' : 'text-task'
  container.appendChild(words);

  // Create input for editing task.
  const inputEdit = document.createElement('input');
  inputEdit.className = 'hide';
  container.appendChild(inputEdit);

  // Create button for save edited task.
  const buttonSave = document.createElement('button');
  buttonSave.innerText = '??????????????????';
  buttonSave.className = 'button-style';
  buttonSave.className = 'hide';
  container.appendChild(buttonSave);

  // Create button for cancellation editing.
  const buttonCancel = document.createElement('button');
  buttonCancel.innerText = '????????????';
  buttonCancel.className = 'button-cancel';
  buttonCancel.className = 'hide';
  container.appendChild(buttonCancel);

  // Create icon for editing task.
  const imageEdit = document.createElement('img');
  imageEdit.src = 'images/pancel.png';
  imageEdit.className = 'img';
  imageEdit.className = isCheck ? 'hide' : 'img';
  container.appendChild(imageEdit);

  // Create icon for delete task.
  const imageDelete = document.createElement('img');
  imageDelete.src = 'images/delete.png';
  imageDelete.className = 'img';
  container.appendChild(imageDelete);
  content.appendChild(container);

  // Launch function for save edited task.
  buttonSave.onclick = () => {
    saveTask(inputEdit.value, item._id);
  }

  // Launch function for cancellation editing.
  buttonCancel.onclick = () => {
    cancelChange(checkbox, imageEdit, imageDelete, inputEdit, buttonSave, buttonCancel)
  }

  // Launch function a click, for editing task.
  imageEdit.onclick = () => {
    changeText(checkbox, text, imageEdit, imageDelete, inputEdit, buttonSave, buttonCancel);
  }

  // Launch function a click, for editing task.
  imageDelete.onclick = () => {
    removeTask(container);
  }
  });
}

const onChangeCheckbox = async (id, isCheck) => {
  const resp = await fetch (`http://localhost:8000/updateTask?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type' : 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin' : '*'
    },
    body: JSON.stringify({
      isCheck: !isCheck
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
}

// Function for delete tasks.
const removeTask = async (collection) => {
  const deleteParams = allTasks.filter((item, index) => index === Number(collection.id))[0]._id;
  const resp = await fetch (`http://localhost:8000/deleteTask?id=${deleteParams}`, {
    method: 'DELETE'
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  checkAllTasks();
  render();
}

// Function for editing tasks.
const changeText = (check, content, image1, image2, input, buttonS, buttonC) => {
  check.classList.add('hide');
  image1.classList.add('hide');
  image2.classList.add('hide');
  input.classList.remove('hide');
  input.classList.add('input-edit');
  buttonS.classList.remove('hide');
  buttonS.classList.add('button-style');
  buttonC.classList.remove('hide');
  buttonC.classList.add('button-cancel');

  input.value = content;
}

// Function for save edited tasks.
const saveTask = async (value, id) => {
  const resp = await fetch (`http://localhost:8000/updateTask?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type' : 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin' : '*'
    },
    body: JSON.stringify({
      text: value
    })
  });
  const result = await resp.json();
  allTasks = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

// Function for cancellation editing.
const cancelChange = (check, image1, image2, input, buttonS, buttonC) => {
  check.classList.remove('hide');
  image1.classList.remove('hide');
  image2.classList.remove('hide');
  input.classList.add('hide');
  buttonS.classList.add('hide');
  buttonC.classList.add('hide');
} 

// Function for sort our tasks.
const sortTasks = () => allTasks.sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0);

// Function for delete all our tasks.
deleteAllTasks = () => {
  allTasks = [];

  localStorage.clear();
  checkAllTasks();
  render();
}

//Function, for hide button for delete all our tasks.
checkAllTasks = () => allTasks.length ? deleteButton.classList.remove('hide') : deleteButton.classList.add('hide');
deleteButton.addEventListener('click', deleteAllTasks);
document.querySelector('.add-button').addEventListener('click', onClickButton);