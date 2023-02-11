const toDoListApp = (() => {
    
    // Array which will contain all tasks
    const tasks = [];

    // Variables for HTML Elements 

    // App container
    const appContainer = document.querySelector('.appContainer');

    // Task container
    const taskList = document.querySelector('.taskList');

    // Input field
    const addTaskInput = document.querySelector('.inputField__input');

    // Task counter display
    const taskCounter = document.querySelector('.stat__tasksLeft');

    // Task statistics buttons
    const allTasksButton = document.getElementById('taskStats__all');
    const incompleteTasksButton = document.getElementById('taskStats__incomplete');
    const completedTasksButton = document.getElementById('taskStats__completed');


    // Variable for maintaining number of completed and incomplete tasks
    let incompleteTasksCount = 0;
    let completeTasksCount = 0;

    // Creates a new task with the given text
    function createTask(text){
        const task = {
            text: text,
            id: Date.now().toString(),
            done: false
        }
        return task;
    }

    // Adds the task to the tasks array and adding the same to the DOM using another function
    function addTask(task) {
        if(task){
            tasks.push(task);            

            if(incompleteTasksButton.classList.contains('selected') || allTasksButton.classList.contains('selected')){
                addTaskToDOM(task);
            }

            ++incompleteTasksCount;
        }
    }

    // Adds the given task to the DOM
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

    // Rendering List based on which task stat option is selected
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

    // Updating the statistics in the DOM  based on the selected statistics option
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

    // Toggling the task as completed of incomplete using taskID
    function toggleCompleteTask(taskID){

        // Searching for the task index from tasks using destructuring
        const taskIndex = tasks.findIndex(({id}) => id === taskID);
        const taskLabel = document.querySelector(`[for="${taskID}"]`);

        // Updating task and statistics based on whether the task is done or not
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

        // If either incomplete or complete tasks is selected the task is removed removed from DOM 
        if(incompleteTasksButton.classList.contains('selected') || completedTasksButton.classList.contains('selected')){
            taskLabel.parentElement.remove();
        }
    }

    // Deletes the task with the given taskID
    function deleteTask(taskID){
        
        // Searching for the task index from tasks using destructuring
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

        // Removing the task from DOM
        task.remove();
    }

    // Completes all tasks present on the DOM
    function completeAllTasks(){

        // Completes all tasks when either all or incomplete tasks are selected 
        if(allTasksButton.classList.contains('selected') || incompleteTasksButton.classList.contains('selected'))
        {
            const listLength = taskList.children.length;
            for(i = 0; i < listLength; ++i){
                // Checking if incomplete is selected so we take every first child instead of 
                // taking the next child as the previous child will be removed from DOM and 
                // the supposed next child will become the first child in case of incomplete
                // task list
                // otherwise we take index as i
                const index = incompleteTasksButton.classList.contains('selected') ? 0 : i;

                // finding data attribute id of DOM element of current task
                const taskID = taskList.children[index].dataset.id;
                // storing the reference of current task in DOM
                const taskDOM = document.getElementById(taskID);
                // finding index of current task in tasks array
                const taskIndex = tasks.findIndex(({id}) => id === taskID);

                if(!tasks[taskIndex].done){
                    toggleCompleteTask(taskID);
                    taskDOM.checked = true;
                }
            }
        }

        // Removes the tasks from DOM if incomplete tasks is selected
        if(incompleteTasksButton.classList.contains('selected')){
            taskList.innerHTML = '';
        }
    }

    // Deletes all the completed tasks that are present on DOM
    function clearCompletedTasks(){

        // Cheking if either all or completed task is selected as incomplete task doesn't contain completed tasks
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
    
    // Handling all inputs 
    function handleInput (event){

        // Enter key input or add button click input
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

            // Handling the rest of the events using if else ladder
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

    // Initializes the app and adds event listeners
    function initialize(){
        addTaskInput.addEventListener('keyup', handleInput);

        // Using event delegation for handling the click inputs 
        appContainer.addEventListener('click', handleInput);        
    }
    
    return {
        initializeApp: initialize,
    }
})();

// Initializing the app
toDoListApp.initializeApp();