import control from './control';
import tasks from './tasks';

const events = (() => {
  // Resize window for responsiveness 
  function resizeWindow() {
    window.addEventListener('resize', control.responsiveMenu);
  }

  function listenClicks() {
    // VARIABLES NOT BE OVERWRITTEN AFTER CLICK EVENT
    let projectIndex;
    let taskIndex;

    document.addEventListener('click', (event) => {
      const { target } = event;
      const modalMainTitle = document.querySelector('.modal-main-title');
      const selectedLink = document.querySelector('.selected-link');
      const linkIndex = parseInt(target.getAttribute('data-link-index'), 10);

      // If on mobile or small screen and clicking toggled button, open/close it
      if (target.classList.contains('toggle-menu') || target.classList.contains('three-line')) {
        control.toggleMenu();
      }

      // If clicking a link, show tasks and change menu title
      if (target.classList.contains('select')) {
        control.selectLink(target, linkIndex);
        control.changeMainTitle(target, linkIndex); // In the main content show title according to selected link title
      }

      // If clicking add project (+)
      if (target.classList.contains('add-project')) {
        control.manipulateModal('show', 'Add Project', 'Add');
      }

      // If clicking edit or delete icon on project menu, open modal
      else if (target.classList.contains('project-icon')) {
        projectIndex = parseInt(target.getAttribute('data-link-index'), 10);

        // Open modal to edit the project
        if (target.classList.contains('edit-project')) {
        control.manipulateModal('show', 'Edit Project', 'Edit', projectIndex);
        } 
        //Open modal to delete project
        else if (target.classList.contains('delete-project')) {
          control.manipulateModal('show', 'Delete Project', 'Delete', projectIndex);
        }
      }

      // If clicking tasks for adding or editing, deleting or expand info, open modal
      if (target.classList.contains('task-icon')) {
        projectIndex = parseInt(target.getAttribute('data-project-index'), 10);
        taskIndex = parseInt(target.getAttribute('data-task-index'), 10);

        //Open modal for adding new task
        if (target.classList.contains('add-task')) {
          control.manipulateModal('show', 'Add Task', 'Add')
        }
        //Open modal for editing a task 
        else if (target.classList.contains('edit-task')) {
          control.manipulateModal('show', 'Edit Task', 'Edit', projectIndex, taskIndex);
        }
        //Open modal for deleting a task 
        else if (target.classList.contains('delete-task')) {
          control.manipulateModal('show', 'Delete Task', 'Delete', projectIndex, taskIndex);
        } 
        //Open modal for expanding info task
        else if (target.classList.contains('fa-info-circle')) {
          control.manipulateModal('show', 'Task Info', '', projectIndex, taskIndex);
        }
      }

      // When clicking add, edit or delete button on modal
      if (target.classList.contains('confirm-modal')) {

        //When pressing adding button on modal
        if (target.textContent === 'Add') {
          projectIndex = parseInt(selectedLink.getAttribute('data-link-index'), 10);
          control.validateModal('add', projectIndex, '', selectedLink);
        } 
        
        //When pressing editing button on modal
        else if (target.textContent === 'Edit') {

          // For editing a project
          if (modalMainTitle.textContent === 'Edit Project') {
            control.validateModal('edit', projectIndex, '', selectedLink);
          } 
          // For editing a task
          else if (modalMainTitle.textContent === 'Edit Task') {
            control.validateModal('edit', projectIndex, taskIndex, selectedLink);
          }
        } 
        
        //When pressing deleting button on modal
        else if (target.textContent === 'Delete') {
          const projectDeletionText = document.querySelector('.project-deletion-text');

          //If project text 'are you sure' is not hidden
          if (!projectDeletionText.classList.contains('hide')) {
            projectIndex = parseInt(selectedLink.getAttribute('data-link-index'), 10);
            control.validateModal('delete', projectIndex, '', selectedLink);
            control.changeMainTitle(target, 0); // After deleting a project - change icon to 'fa-calendar-alt' (menu link 'All')
            control.showMainTitle(0); // After deleting a project - show main title as 'All'
            control.getTasks('all'); // After deleting a project - show all tasks from all remaining projects
          } 
          //If project text 'are you sure' is hidden
          else if (projectDeletionText.classList.contains('hide')) {
            control.validateModal('delete', projectIndex, taskIndex, selectedLink);
          }
        }
      }

      //Closing modal
      if (target.classList.contains('close')) {
        control.manipulateModal('close');
      }

      //Clicking to mark task as complete
      if (target.classList.contains('task-div') ||
        target.classList.contains('fa-circle') ||
        target.classList.contains('fa-check-circle') ||
        target.classList.contains('task-text')
      ) {
        projectIndex = parseInt(target.getAttribute('data-project-index'), 10);
        taskIndex = parseInt(target.getAttribute('data-task-index'), 10);
        tasks.toggleTaskCompletion(projectIndex, taskIndex, selectedLink);
      }
    });
  }

  return {
    resizeWindow,
    listenClicks,
  };
})();

export default events;