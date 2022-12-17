const toDoListApp = (() => {
    
    const tasks = [];
    const taskList = document.querySelector('.taskList');
    const addTaskInput = document.querySelector('.inputField__input');
    const appContainer = document.querySelector('.appContainer');
    const taskCounter = document.querySelector('.stat__tasksLeft');
    const allTasksButton = document.getElementById('taskStats__all');
    const incompleteTasksButton = document.getElementById('taskStats__incomplete');
    const completedTasksButton = document.getElementById('taskStats__completed');



    let incompleteTasksCount = 0;
    let completeTasksCount = 0;

    
    function createTask(text){
        const task = {
            text: text,
            id: Date.now().toString(),
            done: false
        }
        return task;
    }

    function addTask(task) {
        if(task){
            tasks.push(task);            

            if(incompleteTasksButton.classList.contains('selected') || allTasksButton.classList.contains('selected')){
                addTaskToDOM(task);
            }

            ++incompleteTasksCount;
        }
    }
    function addTaskToDOM(task){    
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.innerHTML = `
            <input type="checkbox" id="${task.id}"  class="check-task" ${task.done ? 'checked': ''}>
            <label for="${task.id}" class ="${task.done ? 'completed': ''}">${task.text}</label>
            <img src="./images/crossIcon.png" class="delete-task" data-id="${task.id}" alt="Del">    
        `;

        taskList.append(li);
    }

    function renderList(){
        if(allTasksButton.classList.contains('selected'))
        {
            taskList.innerHTML = '';
            tasks.forEach((task) => {
                addTaskToDOM(task);
            });
        }
        else if(incompleteTasksButton.classList.contains('selected'))
        {
            taskList.innerHTML = '';
            tasks.forEach((task) => {
                if(!task.done){
                    addTaskToDOM(task);
                }
            });            
        }
        else if(completedTasksButton.classList.contains('selected'))
        {
            taskList.innerHTML = '';
            tasks.forEach((task) => {
                if(task.done){
                    addTaskToDOM(task);
                }
            });
        }
    }

    function updateStats(){
        if(allTasksButton.classList.contains('selected'))
        {
            taskCounter.innerText = tasks.length;
        }
        else if(incompleteTasksButton.classList.contains('selected'))
        {
            taskCounter.innerText = incompleteTasksCount;
        }
        else if(completedTasksButton.classList.contains('selected'))
        {
            taskCounter.innerText = completeTasksCount;
        }        
    }

    function toggleCompleteTask(taskID){
        const taskIndex = tasks.findIndex(({id}) => id === taskID);
        const taskLabel = document.querySelector(`[for="${taskID}"]`);

        if(tasks[taskIndex].done){
            tasks[taskIndex].done = false;
            taskLabel.classList.remove('completed');

            ++incompleteTasksCount;
            --completeTasksCount;

        }else{
            tasks[taskIndex].done = true;
            taskLabel.classList.add('completed');

            --incompleteTasksCount;
            ++completeTasksCount;
        }

        if(incompleteTasksButton.classList.contains('selected') || completedTasksButton.classList.contains('selected')){
            taskLabel.parentElement.remove();
        }
    }

    function deleteTask(taskID){
        const taskIndex = tasks.findIndex(({id}) => id === taskID);

        if(tasks[taskIndex].done){
            --completeTasksCount;
        }else{
            --incompleteTasksCount;
        }

        if(taskIndex > -1){
            tasks.splice(taskIndex, 1);
        }
        const task = document.getElementById(taskID).parentElement;
        task.remove();
    }

    function completeAllTasks(){
        if(allTasksButton.classList.contains('selected') || incompleteTasksButton.classList.contains('selected'))
        {
            for (const task of taskList.children) {
                const taskID = task.dataset.id;
                const taskIndex = tasks.findIndex(({id}) => id === taskID);
    
                if(!tasks[taskIndex].done){
                    toggleCompleteTask(taskID);
                    document.getElementById(taskID).checked = true;
                }                
            }
        }

        if(incompleteTasksButton.classList.contains('selected')){
            taskList.innerHTML = '';
        }
    }

    function clearCompletedTasks(){
        if(allTasksButton.classList.contains('selected') || completedTasksButton.classList.contains('selected'))
        {
            let i = 0; 
            while (i < taskList.children.length) {
                const taskID = taskList.children[i].dataset.id;
                const taskIndex = tasks.findIndex(({id}) => id === taskID);
    
                if(tasks[taskIndex].done){
                    deleteTask(taskID);
                }else{
                    ++i;
                }                
            }
        }
    }
    
    function handleInput (event){
        if((event.type === 'keyup' && event.key === 'Enter') || (event.type === 'click' && event.target.className === 'inputField__add')){
            const text = addTaskInput.value;
            if(text === ''){
                return;
            }
            const task = createTask(text);
            addTaskInput.value = '';
            addTask(task);
            updateStats();
        }else if(event.type === 'click'){
            const target = event.target;
            if(target.classList.contains('taskOptions__completeAllTasks'))
            {
                completeAllTasks();
                updateStats();
            } 
            else if(target.classList.contains('taskOptions__clearCompletedTasks'))
            {
                clearCompletedTasks();
                updateStats();
            } 
            else if(target.classList.contains('check-task'))
            {
                toggleCompleteTask(event.target.id);
                updateStats();
            } 
            else if(target.classList.contains('delete-task'))
            {
                deleteTask(event.target.dataset.id);
                updateStats();
            }
            else if(target.id === 'taskStats__all')
            {
                allTasksButton.classList.add('selected');
                incompleteTasksButton.classList.remove('selected');
                completedTasksButton.classList.remove('selected');        
                updateStats();        
                renderList();
            } 
            else if(target.id === 'taskStats__incomplete')
            {
                allTasksButton.classList.remove('selected');
                incompleteTasksButton.classList.add('selected');
                completedTasksButton.classList.remove('selected'); 
                updateStats();
                renderList();
            } 
            else if(target.id === 'taskStats__completed')
            {
                allTasksButton.classList.remove('selected');
                incompleteTasksButton.classList.remove('selected');
                completedTasksButton.classList.add('selected'); 
                updateStats();
                renderList();
            }
        }
    }

    function initialize(){
        addTaskInput.addEventListener('keyup', handleInput);
        appContainer.addEventListener('click', handleInput);        
    }
    
    return {
        initializeApp: initialize,
        // For testing about tasks
        tasks:tasks
    }
})();

toDoListApp.initializeApp();