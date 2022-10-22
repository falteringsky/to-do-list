import dom from './dom';

const projects = (() => {
  let projectsList = [];

  // GET DEFAULT PROJECTS AND TASKS FROM LOCAL STORAGE
  if (localStorage.getItem('projects') === null) {
    projectsList = [
      {
        icon: 'fa-tools',
        title: 'Craft New Project',
        tasks: [
          {
            title: 'The Big Test',
            description: 'Test descrption. 2008, the year where all assets dropped to the floor :(',
            date: '08-08-2008',
            priority: 'low',
            projectIndex: 0,
            taskIndex: 0,
            completed: false
          }
        ]
      },
    ];
  }

  else {
    const projectsFromStorage = JSON.parse(localStorage.getItem('projects'));
    projectsList = projectsFromStorage;
  }

  class Project {
    constructor(icon, title) {
      this.icon = icon;
      this.title = title;
      this.tasks = [];
    }
  }

  function addProject(icon, title) {
    const project = new Project(icon, title);
    projectsList.push(project);
    dom.showProjects();
  }

  function editProject(icon, title, index, link) {
    projectsList[index].icon = icon;
    projectsList[index].title = title;
    dom.showProjects();
    dom.selectLink(link, index, 'edit');
  }

  function deleteProject(index) {
    if (index > -1) {
      projectsList.splice(index, 1);
    }
    dom.showProjects();
  }

  return {
    projectsList,
    addProject,
    editProject,
    deleteProject,
  };
})();

export default projects;