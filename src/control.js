import { format, parseISO, differenceInDays } from 'date-fns';
import projects from './projects';
import tasks from './tasks';

const dom = (() => {
  const toggleMenuIcon = document.querySelector('.toggle-btn');
  const sidebarMenu = document.querySelector('#sidebar-menu');
  const modal = document.querySelector('#modal');
  const form = modal.querySelector('#form');
  const modalTitle = modal.querySelector('#modal-title');
  const modalTitleError = modal.querySelector('.modal-title-error');
  const mainContent = document.querySelector('#main');
  const mainTitleIcon = document.querySelector('.main-title-icon');
  const mainTitleText = document.querySelector('.main-title-text');
  const projectsLinksDiv = document.querySelector('.projects-links-div');
  const addTaskButton = document.querySelector('.add-task');
  const tasksCount = document.querySelector('.tasks-count');
  const tasksList = document.querySelector('.tasks-list');
  const taskDescription = modal.querySelector('.task-description');
  const taskDueDate = modal.querySelector('#dueDate');
  const taskPrioritySelection = modal.querySelector('.task-priority');

  //Responsive page that detects width and adapts for mobile
  function responsiveMenu() {
    if (window.innerWidth <= 1000) {
      toggleMenuIcon.classList.remove('active');

      // Hide sidebar
      sidebarMenu.classList.remove('show-sidebar');
      sidebarMenu.classList.add('hide-sidebar');
      sidebarMenu.classList.add('add-z-index');

      // When sidebar hides, expand menu
      mainContent.classList.remove('contract-main');
      mainContent.classList.add('expand-main');

    } 
    
    else {
      // Show sidebar for PC
      sidebarMenu.classList.remove('hide-sidebar');
      sidebarMenu.classList.add('show-sidebar');
      sidebarMenu.classList.remove('add-z-index');

      // Contract main content for PC
      mainContent.classList.remove('expand-main');
      mainContent.classList.add('contract-main');
      mainContent.classList.remove('inactive-main');
    }
  }

  //Toggle button action that appears for mobile
  function toggleMenu() {
    toggleMenuIcon.classList.toggle('active');

    // Show sidebar when toggling
    if (sidebarMenu.classList.contains('hide-sidebar')) {
      sidebarMenu.classList.remove('hide-sidebar');
      sidebarMenu.classList.add('show-sidebar');
      mainContent.classList.add('inactive-main');
    }
    
    // Hide sidebar when toggling
    else if (sidebarMenu.classList.contains('show-sidebar')) {
      sidebarMenu.classList.remove('show-sidebar');
      sidebarMenu.classList.add('hide-sidebar');
      mainContent.classList.remove('inactive-main');
    }
  }


  // With index, pass the title to main content tasks title
  function showMainTitle(index) {
    const menuTexts = document.querySelectorAll('.menu-link-text');

    mainTitleText.textContent = menuTexts[index].textContent;
    // document.title = `ToDo - ${mainTitleText.textContent}`;
  }

  function changeMainTitle(target, index) {
    mainTitleIcon.className = '';

    // Title of menu links, move over to main content tasks title
    if (target.classList.contains('menu-link') || target.classList.contains('menu-link-text')) {
      showMainTitle(index);
    }

    // Title of projects, move over to main content tasks title
    if (
      target.classList.contains('project-link') ||
      target.classList.contains('project-icon') ||
      target.classList.contains('project-text') ||
      target.classList.contains('delete-project') ||
      target.classList.contains('edit-project') ||
      target.classList.contains('project-icon-and-text-div') ||
      target.classList.contains('project-default-icons-div')
    ) {
      const projectIcon = projects.projectsList[index].icon;

      mainTitleIcon.classList.add(
        'fal',
        'fa-fw',
        'main-title-icon',
        'padding-right',
        projectIcon
      );

      mainTitleText.textContent = projects.projectsList[index].title;
      // document.title = `ToDo - ${mainTitleText.textContent}`;
    }
  }

  //Expand task info already created to see contents
  function watchTaskInfo(projectIndex, taskIndex) {
    const infoTaskTitle = document.querySelector('.info-task-title');
    const infoTaskDescription = document.querySelector('.info-task-description');
    const infoTaskDueDate = document.querySelector('.info-task-due-date');
    const infoTaskPriority = document.querySelector('.info-task-priority');
    const infoTaskProject = document.querySelector('.info-task-project');

    // Task title
    infoTaskTitle.textContent =
      projects.projectsList[projectIndex].tasks[taskIndex].title;

    // Task description
    infoTaskDescription.textContent =
      projects.projectsList[projectIndex].tasks[taskIndex].description;

    // Task due date    
    infoTaskDueDate.textContent =
      projects.projectsList[projectIndex].tasks[taskIndex].date;

    // Task priority
    if (projects.projectsList[projectIndex].tasks[taskIndex].priority === 'low') {
      infoTaskPriority.textContent = 'Low Priority';
    } 
    
    else if (projects.projectsList[projectIndex].tasks[taskIndex].priority === 'medium') {
      infoTaskPriority.textContent = 'Medium Priority';
    }

    else if (projects.projectsList[projectIndex].tasks[taskIndex].priority === 'high') {
      infoTaskPriority.textContent = 'High Priority';
    }
    
    else {
      infoTaskPriority.textContent = '';
    }

    // Task project
    infoTaskProject.textContent = projects.projectsList[projectIndex].title;
  }

  //Pass modal-data and control modal
  function manipulateModal(modalState, modalTask, modalAction, projectIndex, taskIndex) {
    const taskInfoDiv = modal.querySelector('.info-div');
    const modalHeader = modal.querySelector('.modal-header');
    const modalMainTitle = modal.querySelector('.modal-main-title');
    const modalTaskButton = modal.querySelector('.modal-task-button');

    const projectDeletionText = modal.querySelector('.project-deletion-text');
    const taskDeletionText = modal.querySelector('.task-deletion-text');

    const confirmButton = modal.querySelector('.confirm-modal');
    const cancelButton = modal.querySelector('.cancel-modal');

    modalHeader.classList.remove('deletion-modal-header');
    form.reset();
    form.classList.remove('hide');
    taskInfoDiv.classList.add('hide');
    modalTitleError.classList.add('hide');
    projectDeletionText.classList.add('hide');
    taskDeletionText.classList.add('hide');
    cancelButton.classList.remove('cancel-deletion');
    confirmButton.classList.remove('confirm-deletion', 'hide');

    //Modal state activated
    if (modalState === 'show') {
      const modalIconsDiv = modal.querySelector('.radio-form');
      const modalTasksDiv = modal.querySelector('.modal-tasks-div');

      //Defualt to Add project modal
      modal.classList.remove('hide');
      modalMainTitle.textContent = modalTask;
      modalTaskButton.textContent = modalAction;
      modalIconsDiv.classList.remove('hide');
      modalIconsDiv.classList.add('show');
      modalTasksDiv.classList.add('hide');

      // If modal is for editing existing project
      if (modalTask === 'Edit Project') {
        const allProjectIcons = modal.querySelectorAll('.icon');
        const projectIcon = projects.projectsList[projectIndex].icon;

        // Show editable title of project
        modalTitle.value = projects.projectsList[projectIndex].title;

        // Select the editable icon of project
        for (let i = 0; i < allProjectIcons.length; i += 1) {
          if (allProjectIcons[i].value === projectIcon) {
            allProjectIcons[i].checked = true;
          }
        }
      }

      // If modal is for adding a task or editing a existing task
      else if (modalTask === 'Add Task'|| modalTask === 'Edit Task') {
        modalIconsDiv.classList.remove('show');
        modalIconsDiv.classList.add('hide');
        modalTasksDiv.classList.remove('hide');

        //Take data in object and populate in edit modal
        if (modalTask === 'Edit Task') {
          modalTitle.value = projects.projectsList[projectIndex].tasks[taskIndex].title;
          taskDescription.value = projects.projectsList[projectIndex].tasks[taskIndex].description;
          taskDueDate.value = projects.projectsList[projectIndex].tasks[taskIndex].date;
          taskPrioritySelection.value = projects.projectsList[projectIndex].tasks[taskIndex].priority;
        }
      } 
      
      // If modal is to see task information
      else if (modalTask === 'Task Info') {
        form.classList.add('hide');
        confirmButton.classList.add('hide');
        taskInfoDiv.classList.remove('hide');
        watchTaskInfo(projectIndex, taskIndex);
      }
    }

    // Delete modal content, when NOT in add or edit
    if (modalAction === 'Delete') {
      modalHeader.classList.add('deletion-modal-header');
      form.classList.add('hide');
      cancelButton.classList.add('cancel-deletion');
      confirmButton.classList.add('confirm-deletion');

      // If delete project
      if (modalTask === 'Delete Project') {
        const projectDeletionTitle = document.querySelector('.project-deletion-title');

        projectDeletionText.classList.remove('hide');
        projectDeletionTitle.textContent = projects.projectsList[projectIndex].title;
      } 
      
       // If not deleting project, delete task
      else if (modalTask === 'Delete Task') {
        const taskDeletionTitle = document.querySelector('.task-deletion-title');

        taskDeletionText.classList.remove('hide');
        taskDeletionTitle.textContent = projects.projectsList[projectIndex].tasks[taskIndex].title;
      }
    }

    // To hide modal
    if (modalState === 'close') {
      modal.classList.add('hide');
    }
  }

  //Generation of Tasks created and then shown
  function showTasks(menuTitle, projectIndexStart, projectIndexEnd) {
    const todayDate = format(new Date(), 'MM-DD-YYYY');
    let tasksNumber = 0;

    tasksCount.textContent = 0;
    tasksList.textContent = '';

    // Create and show tasks list for projects created
    for (let i = projectIndexStart; i < projectIndexEnd; i += 1) {
      //Show for each task created
      for (let j = 0; j < projects.projectsList[i].tasks.length; j += 1) {
        const taskDiv = document.createElement('div');
        const taskIconAndTextDiv = document.createElement('div');
        const taskIcon = document.createElement('i');
        const taskText = document.createElement('p');
        const taskInfo = document.createElement('div');
        const taskDate = document.createElement('p');
        const taskEditIcon = document.createElement('i');
        const taskTrashIcon = document.createElement('i');
        const taskInfoIcon = document.createElement('i');

        //If click on menu link on nav bar 'Important' - FILTER OUT THE NOT IMPORTANT TASKS
        if (menuTitle === 'important' && projects.projectsList[i].tasks[j].priority !== 'high') {
          continue; // If task isn't important - skip it
        } 

        //If click on menu link on nav bar 'Today'
        else if (menuTitle === 'today') {

          if (projects.projectsList[i].tasks[j].date !== todayDate) {
            continue; // If task isn't for today - skip it
          }
        } 
        
        //If click on menu link on nav bar 'Week'
        else if (menuTitle === 'week') {
          const dateOfToday = parseISO(todayDate);
          const dateOfTask = parseISO(projects.projectsList[i].tasks[j].date)

          if (!(differenceInDays(dateOfTask, dateOfToday) <= 7 && differenceInDays(dateOfTask, dateOfToday) >= 0)) {
           continue; // If the task isn't due within a week from today - skip it
          }
        } 
        
        //If click on menu link on nav bar 'Completed'
        else if (menuTitle === 'completed' && projects.projectsList[i].tasks[j].completed !== true) {
          continue; // If task isn't completed yet - skip it
        }

        // Show quantity of tasks counter
        tasksNumber += 1;
        tasksCount.textContent = tasksNumber;

        // Tasks priority, text and divs classes
        taskDiv.classList.add('task-div', 'hover-element');
        taskIconAndTextDiv.classList.add('flex');
        taskDiv.setAttribute('data-project-index', i);
        taskDiv.setAttribute('data-task-index', j);

        if (projects.projectsList[i].tasks[j].priority === 'low') {
          taskIcon.classList.add('low-priority');
        } 
        
        else if (projects.projectsList[i].tasks[j].priority === 'medium') {
          taskIcon.classList.add('mid-priority');
        } 
        
        else if (projects.projectsList[i].tasks[j].priority === 'high') {
          taskIcon.classList.add('high-priority');
        } 
        
        else {
          taskIcon.classList.add('fal', 'padding-right');
        }

        taskIcon.setAttribute('data-project-index', i);
        taskIcon.setAttribute('data-task-index', j);

        taskText.classList.add('task-text');
        taskText.textContent = projects.projectsList[i].tasks[j].title;
        taskText.setAttribute('data-project-index', i);
        taskText.setAttribute('data-task-index', j);

        // Tasks information class for css format
        taskInfo.classList.add('flex');

        // Tasks due date show from existing task
        taskDate.classList.add('due-date', 'padding-right');
        if (projects.projectsList[i].tasks[j].date !== undefined) {
          taskDate.textContent = projects.projectsList[i].tasks[j].date;
        } 
        
        else {
          taskDate.textContent = '';
        }

        // Task edit button on right
        taskEditIcon.classList.add(
          'fal',
          'fa-edit',
          'edit-task',
          'task-icon',
          'scale-element',
          'padding-right'
        );
        taskEditIcon.setAttribute('data-project-index', i);
        taskEditIcon.setAttribute('data-task-index', j);

        // Task delete button on right
        taskTrashIcon.classList.add(
          'fal',
          'fa-trash-alt',
          'delete-task',
          'task-icon',
          'scale-element',
          'padding-right'
        );
        taskTrashIcon.setAttribute('data-project-index', i);
        taskTrashIcon.setAttribute('data-task-index', j);

        // Task expand info button on right
        taskInfoIcon.classList.add(
          'fal',
          'task-icon',
          'scale-element',
          'fa-info-circle'
        );
        taskInfoIcon.setAttribute('data-project-index', i);
        taskInfoIcon.setAttribute('data-task-index', j);

        //Tasks lists append and childs
        taskIconAndTextDiv.appendChild(taskIcon);
        taskIconAndTextDiv.appendChild(taskText);
        taskInfo.appendChild(taskDate);
        taskInfo.appendChild(taskEditIcon);
        taskInfo.appendChild(taskTrashIcon);
        taskInfo.appendChild(taskInfoIcon);
        taskDiv.appendChild(taskIconAndTextDiv);
        taskDiv.appendChild(taskInfo);
        tasksList.appendChild(taskDiv);

        // If task is marked complete 'true' on projectlist, add class taskdone to linethrough task
        if (projects.projectsList[i].tasks[j].completed === false) {
          taskText.classList.remove('task-done-text');
          taskIcon.classList.add(
            'fal',
            'fa-circle',
            'padding-right'
          );
        } 
        
        else {
          taskText.classList.add('task-done-text');
          taskIcon.classList.add(
            'fal',
            'fa-check-circle',
            'padding-right'
          );
        }
      }
    }
    //Close modal
    manipulateModal('close');
  }

  //Get existing tasks from projects, create tasks and show them
  function getTasks(menuTitle, projectIndex) {
    let projectIndexStart;
    let projectIndexEnd;

    // Save projects on list to local storage
    localStorage.setItem('projects', JSON.stringify(projects.projectsList));

    // If clicking in a specific project off the project list link
    if (menuTitle === 'project') {
      projectIndexStart = projectIndex;
      projectIndexEnd = projectIndex + 1;

      // If project doesn't have any tasks
      if (projects.projectsList[projectIndex].tasks.length === 0) {
        tasksCount.textContent = 0;
      }
    }

    // If clicking in a specific menu link off such as 'today' etc
    else {
      projectIndexStart = 0;
      projectIndexEnd = projects.projectsList.length;
    }

    showTasks(menuTitle, projectIndexStart, projectIndexEnd);
  }

  //Menu and project links
  function selectLink(target, index, action) {
    const allLinks = document.querySelectorAll('.link');
    const allProjectsLinks = document.querySelectorAll('.project-link');
    const menuTitle = target.getAttribute('data-title');

    addTaskButton.classList.add('hide'); // By default 'Add Task' button is hidden

    allLinks.forEach((link) => {
      link.classList.remove('selected-link');
    });

    // When clicking in any link, menu or project, add class
    if (target.classList.contains('link')) {
      target.classList.add('selected-link');

      // If haven't clicked on menu or project link but press edit button on projects link
      if (action === 'edit') {
        allProjectsLinks[index].classList.add('selected-link'); // Keep project visually selected after editing
      }
    } 
     
    // If clicking on tet or icon button of menu link
    else if (target.classList.contains('menu-link-icon') || target.classList.contains('menu-link-text')) {
      target.parentElement.classList.add('selected-link');
    }

    // If clicking on projects link
    if (target.classList.contains('project')) {
      addTaskButton.classList.remove('hide'); // Show button to add task for selected project
      
      //Get tasks and populate them
      getTasks('project', index);

      // If clicking on any of the text, button or delete on project link
      if (
        target.classList.contains('project-icon') ||
        target.classList.contains('project-text') ||
        target.classList.contains('edit-project') ||
        target.classList.contains('delete-project')
      ) {
        target.parentElement.parentElement.classList.add('selected-link');
      } 
      
      // If clicking on any other place within the project link selected
      else if (target.classList.contains('project-icon-and-text-div') || target.classList.contains('project-default-icons-div')) {
        target.parentElement.classList.add('selected-link');
      }
    }

    // If licking any menu link, get and show tasks for that menu
    if(target.classList.contains('menu-link') || target.classList.contains('menu-link-icon') || target.classList.contains('menu-link-text')) {
      getTasks(menuTitle);
    }
  }

  //Modal control when pressing add, edit, delete 
  function validateModal(modalAction, projectIndex, taskIndex, clickedLink) {
    const { projectFormIcon } = document.forms.form;
    const projectDomIcon = projectFormIcon.value;
    const projectIconsDiv = modal.querySelector('.radio-form');
    const modalTitleText = modalTitle.value;
    const projectDeletionText = document.querySelector('.project-deletion-text');
    const menuLinkAll = document.querySelector('.link:first-child');
    let taskPriority;

    // CHECK FOR MODAL TITLE ERROR IF MODAL FORM IS SHOWN
    if (!form.classList.contains('hide') && modalTitleText === '') {
      modalTitleError.classList.remove('hide');
      modalTitleError.classList.add('show');
    } 

    // Add button to add project to array
    else if (modalAction === 'add' && projectIconsDiv.classList.contains('show')) {
      projects.addProject(projectDomIcon, modalTitleText);
      mainContent.classList.remove('inactive-main');

      // Get last project created link and index, and keep it as selected
      const lastProject = projectsLinksDiv.lastChild;
      const lastProjectIndex = projectsLinksDiv.lastChild.getAttribute('data-link-index');

      selectLink(lastProject, lastProjectIndex);
      changeMainTitle(lastProject, lastProjectIndex);
    } 
    
    // Edit button to edit project array and show
    else if (modalAction === 'edit' && projectIconsDiv.classList.contains('show')) {
      const allProjectsLinks = document.querySelectorAll('.project-link');
      const editedProject = allProjectsLinks[projectIndex];

      projects.editProject(projectDomIcon, modalTitleText, projectIndex, clickedLink);
      changeMainTitle(editedProject, projectIndex);
    } 
    
    //Delete projects from array
    else if (modalAction === 'delete' && !projectDeletionText.classList.contains('hide')) {
      projects.deleteProject(projectIndex);
      menuLinkAll.classList.add('selected-link');
      addTaskButton.classList.add('hide');
    } 
    
    //Add task to array
    else if (modalAction === 'add' && projectIconsDiv.classList.contains('hide')) {

      // Check tasks priority
      if (taskPrioritySelection.value === 'low') {
        taskPriority = 'low';
      } 
      else if (taskPrioritySelection.value === 'medium') {
        taskPriority = 'medium';
      } 
      else if (taskPrioritySelection.value === 'high') {
        taskPriority = 'high';
      } 
      else {
        taskPriority = '';
      }

      //Add tasks
      tasks.addTask(
        modalTitleText,
        taskDescription.value,
        taskDueDate.value,
        taskPriority,
        projectIndex
      );
    } 
    
    // If clicking to edit or delete a task
    else if (modalAction === 'edit' || modalAction === 'delete') {
      let menuTitle;

      // If task is being deleted or edited from menu link 'today' etc selected
      if (clickedLink.classList.contains('menu-link')) {
        menuTitle = clickedLink.getAttribute('data-title');
      }
      // If task is being deleted or edited from project link selected
      else if (clickedLink.classList.contains('project-link')) {
        menuTitle = 'project';
      }

      // If clicking to edit task, change array
      if (modalAction === 'edit') {
        const taskNewTitle = modalTitle.value;
        const taskNewDescription = taskDescription.value;
        const taskNewDate = taskDueDate.value;
        const taskNewPriority = taskPrioritySelection.value;

        //Edit task array
        tasks.editTask(
          taskNewTitle,
          taskNewDescription,
          taskNewDate,
          taskNewPriority,
          projectIndex,
          taskIndex
        );
      } 
      // If clicking to delete task, change array
      else if (modalAction === 'delete') {
        tasks.deleteTask(projectIndex, taskIndex);
      }

      getTasks(menuTitle, projectIndex);
    }
  }

  //Show projects
  function showProjects() {
    const projectsCount = document.querySelector('.projects-count');

    // Save project list to local storage 
    localStorage.setItem('projects', JSON.stringify(projects.projectsList));

    // Show counter of number of projects
    projectsCount.textContent = projects.projectsList.length;
    projectsLinksDiv.textContent = '';

    // Select all projects in array
    for (let i = 0; i < projects.projectsList.length; i += 1) {
      const projectLink = document.createElement('a');
      const projectIconAndTextDiv = document.createElement('div');
      const projectIcon = document.createElement('i');
      const projectText = document.createElement('p');
      const projectIconsDiv = document.createElement('div');
      const projectEditIcon = document.createElement('i');
      const projectTrashIcon = document.createElement('i');

      //Project icon and text classes
      projectIconAndTextDiv.classList.add(
        'project-icon-and-text-div',
        'project',
        'select'
      );
      projectIconAndTextDiv.setAttribute('data-link-index', i);
      projectIconsDiv.classList.add(
        'project-default-icons-div',
        'project',
        'select'
      );
      projectIconsDiv.setAttribute('data-link-index', i);

      // Project links add classes
      projectLink.classList.add('link', 'project-link', 'project', 'select');
      projectLink.setAttribute('href', '#');
      projectLink.setAttribute('data-link-index', i);

      // Project icon add classes
      projectIcon.classList.add(
        'fal',
        'fa-fw',
        'project-icon',
        'project',
        'select',
        'padding-right',
        projects.projectsList[i].icon
      );
      projectIcon.setAttribute('data-link-index', i);

      // Project text add classes and title
      projectText.classList.add('project-text', 'project', 'select');
      projectText.textContent = projects.projectsList[i].title;
      projectText.setAttribute('data-link-index', i);

      // Project add default icon of radio-buttons
      projectEditIcon.classList.add(
        'fal',
        'fa-edit',
        'project',
        'project-icon',
        'edit-project',
        'select',
        'scale-element',
        'padding-right'
      );
      projectEditIcon.setAttribute('data-link-index', i);

      projectTrashIcon.classList.add(
        'fal',
        'fa-trash-alt',
        'project',
        'project-icon',
        'delete-project',
        'select',
        'scale-element'
      );
      projectTrashIcon.setAttribute('data-link-index', i);

      // Appending to main project div
      projectIconsDiv.appendChild(projectEditIcon);
      projectIconsDiv.appendChild(projectTrashIcon);
      projectIconAndTextDiv.appendChild(projectIcon);
      projectIconAndTextDiv.appendChild(projectText);
      projectLink.appendChild(projectIconAndTextDiv);
      projectLink.appendChild(projectIconsDiv);
      projectsLinksDiv.appendChild(projectLink);
    }
    manipulateModal('close');
  }

  return {
    responsiveMenu,
    toggleMenu,
    showMainTitle,
    changeMainTitle,
    manipulateModal,
    showTasks,
    getTasks,
    selectLink,
    validateModal,
    showProjects
  };
})();

export default dom;