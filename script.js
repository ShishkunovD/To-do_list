let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let valueInput = '';
let input = null;
const deleteButton = document.querySelector('.delete-all');

window.onload = function init() {
    input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    checkAllTasks();
    render();
}

onClickButton = () => {
    allTasks.push({
        text: valueInput,
        isCheck: false,
        result: 0
    })
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    valueInput = '';
    input.value = '';
    checkAllTasks();
    render();
}

updateValue = (event) => {
    valueInput = event.target.value;
}

render = () => {
    const content = document.getElementById('content-page');
    while(content.firstChild) {
        content.removeChild(content.firstChild)
    }
    allTasks.map((item, index) => {
        const container = document.createElement('div');
        container.id = `task-${index}`;
        container.className = 'task-container';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.checked = item.isCheck;
        checkbox.onchange = function () {
            onChangeCheckbox(index);
            sort(allTasks);
        }
        container.appendChild(checkbox);

        const text = document.createElement('p');
        text.innerText = item.text;
        text.className = item.isCheck ? 'text-task done-text' : 'text-task'
        container.appendChild(text);

        // Создаем input для редактирование задачи.
        const inputEdit = document.createElement('input');
        inputEdit.className = 'hide';
        container.appendChild(inputEdit);

        // Создаем кнопку для сохранения отредактированной задачи.
        const buttonSave = document.createElement('button');
        buttonSave.innerText = 'Сохранить';
        buttonSave.className = 'button-style';
        buttonSave.className = 'hide';
        container.appendChild(buttonSave);

        // Создаем кнопку для отмены редактирования.
        const buttonCancel = document.createElement('button');
        buttonCancel.innerText = 'Отмена';
        buttonCancel.className = 'button-cancel';
        buttonCancel.className = 'hide';
        container.appendChild(buttonCancel);

        // Создаем иконку для редактирования задачи.
        const imageEdit = document.createElement('img');
        imageEdit.src = 'images/pancel.png';
        imageEdit.className = 'img';
        imageEdit.className = item.isCheck ? 'hide' : 'img';
        container.appendChild(imageEdit);

        // Создаем иконку для удаления задачи.
        const imageDelete = document.createElement('img');
        imageDelete.src = 'images/delete.png';
        imageDelete.className = 'img';
        container.appendChild(imageDelete);
        content.appendChild(container);

        // Запускаем функцию для сохранения отредактированной задачи.
        buttonSave.onclick = function () {
            saveTask(inputEdit, index);
        }

        // Запускаем функцию для отмены редактирования.
        buttonCancel.onclick = function () {
            cancelChange(checkbox, imageEdit, imageDelete, inputEdit, buttonSave, buttonCancel)
        }

        // Запускаем функцию по клику, для редактирования задачи.
        imageEdit.onclick = function () {
            changeText(checkbox, item.text, imageEdit, imageDelete, inputEdit, buttonSave, buttonCancel);
        }

        // Запускаем функцию по клику для удаления задачи.
        imageDelete.onclick = function () {
            removeTask(container);
        }
    });
}

 onChangeCheckbox = (index) => {
    allTasks[index].isCheck = !allTasks[index].isCheck;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}

// Функция для удаления тасков.
removeTask = (collection) => {
    allTasks = allTasks.filter((item, index) => {
        if(`task-${index}` !== collection.id) {
            return true;
        }
    })
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    
    checkAllTasks();
    render();
}

// Функция для редактирования тасков.
changeText = (check, content, image1, image2, input, buttonS, buttonC) => {
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

// Функция для сохранения отредактированных тасков.
saveTask = (input, index) => {
    allTasks[index].text = input.value;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
}

// Функция для отмены редактирования.
cancelChange = (check, image1, image2, input, buttonS, buttonC) => {
    check.classList.remove('hide');
    image1.classList.remove('hide');
    image2.classList.remove('hide');
    input.classList.add('hide');
    buttonS.classList.add('hide');
    buttonC.classList.add('hide');
} 

// Функция для сортировки наших тасков.
sort = (array) => {
     array.forEach(item => {
         if(item.isCheck === true) {
             item.result = 1
         } else {
             item.result = 0;
         }
     });

     array.sort((a, b) => {
         return a.result - b.result;
     });
     render();
}

// Функция для удаления всех тасков.
deleteAllTasks = () => {
    allTasks = allTasks.filter((item, index) => {
        if(index === -1) {
            return true;
        }
    });
    localStorage.clear();
    checkAllTasks();
    render();
}

//Функция, для скрытия кнопки удаления всех тасков.
checkAllTasks = () => {
    if(allTasks.length === 0) {
        deleteButton.classList.add('hide');
    } else {
        deleteButton.classList.remove('hide');
    }
}

deleteButton.addEventListener('click', deleteAllTasks);
document.querySelector('.add-button').addEventListener('click', onClickButton);
