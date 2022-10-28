import dom from './control';
import tasks from './tasks';

const handlers = (() => {
  // Resize window for responsiveness 
  function resizeWindow() {
    window.addEventListener('resize', dom.responsiveMenu);
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
        dom.toggleMenu();
      }

      // If clicking a link, show tasks and change menu title
      if (target.classList.contains('select')) {
        dom.selectLink(target, linkIndex);
        dom.changeMainTitle(target, linkIndex); // In the main content show title according to selected link title
      }

      // If clicking add project (+)
      if (target.classList.contains('add-project')) {
        dom.manipulateModal('show', 'Add Project', 'Add');
      }

      // If clicking edit or delete icon on project menu, open modal
      else if (target.classList.contains('project-icon')) {
        projectIndex = parseInt(target.getAttribute('data-link-index'), 10);

        // Open modal to edit the project
        if (target.classList.contains('edit-project')) {
        dom.manipulateModal('show', 'Edit Project', 'Edit', projectIndex);
        } 
        //Open modal to delete project
        else if (target.classList.contains('delete-project')) {
          dom.manipulateModal('show', 'Delete Project', 'Delete', projectIndex);
        }
      }

      // If clicking tasks for adding or editing, deleting or expand info, open modal
      if (target.classList.contains('task-icon')) {
        projectIndex = parseInt(target.getAttribute('data-project-index'), 10);
        taskIndex = parseInt(target.getAttribute('data-task-index'), 10);

        //Open modal for adding new task
        if (target.classList.contains('add-task')) {
          dom.manipulateModal('show', 'Add Task', 'Add')
        }
        //Open modal for editing a task 
        else if (target.classList.contains('edit-task')) {
          dom.manipulateModal('show', 'Edit Task', 'Edit', projectIndex, taskIndex);
        }
        //Open modal for deleting a task 
        else if (target.classList.contains('delete-task')) {
          dom.manipulateModal('show', 'Delete Task', 'Delete', projectIndex, taskIndex);
        } 
        //Open modal for expanding info task
        else if (target.classList.contains('fa-info-circle')) {
          dom.manipulateModal('show', 'Task Info', '', projectIndex, taskIndex);
        }
      }

      // When clicking add, edit or delete button on modal
      if (target.classList.contains('confirm-modal')) {

        //When pressing adding button on modal
        if (target.textContent === 'Add') {
          projectIndex = parseInt(selectedLink.getAttribute('data-link-index'), 10);
          dom.validateModal('add', projectIndex, '', selectedLink);
        } 
        
        //When pressing editing button on modal
        else if (target.textContent === 'Edit') {

          // For editing a project
          if (modalMainTitle.textContent === 'Edit Project') {
            dom.validateModal('edit', projectIndex, '', selectedLink);
          } 
          // For editing a task
          else if (modalMainTitle.textContent === 'Edit Task') {
            dom.validateModal('edit', projectIndex, taskIndex, selectedLink);
          }
        } 
        
        //When pressing deleting button on modal
        else if (target.textContent === 'Delete') {
          const projectDeletionText = document.querySelector('.project-deletion-text');

          //If project text 'are you sure' is not hidden
          if (!projectDeletionText.classList.contains('hide')) {
            projectIndex = parseInt(selectedLink.getAttribute('data-link-index'), 10);
            dom.validateModal('delete', projectIndex, '', selectedLink);
            dom.changeMainTitle(target, 0); // After deleting a project - change icon to 'fa-calendar-alt' (menu link 'All')
            dom.showMainTitle(0); // After deleting a project - show main title as 'All'
            dom.getTasks('all'); // After deleting a project - show all tasks from all remaining projects
          } 
          //If project text 'are you sure' is hidden
          else if (projectDeletionText.classList.contains('hide')) {
            dom.validateModal('delete', projectIndex, taskIndex, selectedLink);
          }
        }
      }

      //Closing modal
      if (target.classList.contains('close')) {
        dom.manipulateModal('close');
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

export default handlers;