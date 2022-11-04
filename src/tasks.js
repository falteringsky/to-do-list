import projects from './projects';
import control from './control';

const tasks = (() => {
  class Task {
    constructor(title, description, date, priority, projectIndex, taskIndex) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.priority = priority;
    this.projectIndex = projectIndex;
    this.taskIndex = taskIndex;
    this.completed = false;
    }
  }

    function addTask(title, description, date, priority, projectIndex, taskIndex) {
        const task = new Task(title, description, date, priority, projectIndex, taskIndex);
    
        projects.projectsList[projectIndex].tasks.push(task);
        control.getTasks('project', projectIndex);
      }
    
      function editTask(title, description, date, priority, projectIndex, taskIndex) {
        projects.projectsList[projectIndex].tasks[taskIndex].title = title;
        projects.projectsList[projectIndex].tasks[taskIndex].description = description;
        projects.projectsList[projectIndex].tasks[taskIndex].date = date;
        projects.projectsList[projectIndex].tasks[taskIndex].priority = priority;
        control.getTasks('project', projectIndex);
      }
    
      function deleteTask(projectIndex, taskIndex) {
        if (projectIndex > -1) {
          projects.projectsList[projectIndex].tasks.splice(taskIndex, 1);
          control.getTasks('all');
        }
      }
    
      function toggleTaskCompletion(projectIndex, taskIndex, selectedLink) {
        let clickedLink;
    
        if (projects.projectsList[projectIndex].tasks[taskIndex].completed === false) {
          projects.projectsList[projectIndex].tasks[taskIndex].completed = true;
        } 
        else {
          projects.projectsList[projectIndex].tasks[taskIndex].completed = false;
        }
    
        if (selectedLink.classList.contains('project')) {
          clickedLink = 'project';
        } 
        else {
          clickedLink = selectedLink.getAttribute('data-link-title');
        }
        control.getTasks(clickedLink, projectIndex);
      }
    
      return {addTask, editTask, deleteTask, toggleTaskCompletion};
    })();
    
    export default tasks;