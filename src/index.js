import dom from './control';
import events from './events';

// When opening app, menu link all is loaded and shown
dom.showMainTitle(0);

// When opening app, show default projects and saved on local
dom.showProjects();

// WHen opneing, app load and show tasks for projects
dom.getTasks('all');

dom.responsiveMenu();
events.resizeWindow();
events.listenClicks();