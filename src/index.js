import control from './control';
import events from './events';

// When opening app, menu link all is loaded and shown
control.showMainTitle(0);

// When opening app, show default projects and saved on local
control.showProjects();

// WHen opneing, app load and show tasks for projects
control.getTasks('all');

control.responsiveMenu();
events.resizeWindow();
events.listenClicks();