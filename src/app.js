
import { inject } from 'aurelia-framework';
import { HttpClient } from "../node_modules/aurelia-http-client";

import { Index } from "./index";
import { Management } from "./management";
import { Post } from "./post";
import moment from "../node_modules/moment/moment";

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(HttpClient)
export class App {
  
  constructor(HttpClient) {
    this.httpClient = HttpClient;
    this.httpClient.get('https://dog.ceo/api/breeds/list/all').then(data => {console.log(data.content.message);});
    this.current_date = `${moment().format("YYYY-MM-DD")}`;
  }

  /**
      Array of routes that'll be injected in the </router-view> element
      route: trailing url
        :/slug <- variable
      name: will be mapped against route-href defined in a view
      moduleId: maps the component we want to show
      title: Will be combined with config.title -> Home | Docu router
  */
  configureRouter(config, router) {
    this.router = router;
    config.title = 'Docu manager';
    
    config.map([
      { route: '', name: 'home', moduleId:'index', title:'Home' },
      { route: 'management', name: 'management', moduleId:'management', title:'Management' },
      { route: 'post/:slug', name: 'post', moduleId:'post', title:'View Post' }
    ]);
  }

}
