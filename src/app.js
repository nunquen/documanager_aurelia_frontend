
import { Document } from "./services/document";
import { Index } from "./index";
import { inject } from 'aurelia-framework';
import { Management } from "./management";
import { moment } from "../node_modules/moment/moment";
import { Post } from "./post";
import { User } from "./services/user";
import { UserDto } from './backend/dtos/user-dto';
import { DocumentDto } from './backend/dtos/document-dto';
import { AuthService } from './services/auth-service';
import { login } from './auth/login';
import { EventAggregator } from 'aurelia-event-aggregator';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(AuthService, EventAggregator, User, Document)
export class App {
  /**
      Array of routes that'll be injected in the </router-view> element
      route: trailing url
        :/slug <- variable
      name: will be mapped against route-href defined in a view
      moduleId: maps the component we want to show
      title: Will be combined with config.title -> Home | Docu router
  */
  constructor(AuthService, EventAggregator, User, Document){
    this.User = User;
    this.users = [];
    this.Document = Document;
    this.documents = [];
    this.auth_service = AuthService;
    this.ea = EventAggregator;
  }

  attached() {
    this.current_user = this.auth_service.current_user;
    // Subscribing to published user
    this.subscription = this.ea.subscribe('user', user => {
      this.current_user = this.auth_service.current_user;
    });
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'Documanager';
    
    config.map([
      { route: '', name: 'home', moduleId:'index', title:'Home' },
      { route: 'login', name: 'login', moduleId:'auth/login', title:'Login' },
      { route: 'logout', name: 'logout', moduleId:'auth/logout', title:'Logout' },
      { route: 'management', name: 'management', moduleId:'management', title:'Management' },
      { route: 'post/:slug', name: 'post', moduleId:'post', title:'View Post' }
    ]);
  }
  
  async bind(){
    this.users = await this.loadUsersJson();
    this.user_list = [];
    var user = null;
    var doc_list = [];
    var docs = null;
    var doc = null;

    for (var i = 0; i < this.users.length; i++){
      console.log(`User ${this.users[i].name} with id ${this.users.id}`);
      user = new UserDto(
        this.users[i]["id"],
        this.users[i]["name"],
        this.users[i]["password"]);

      doc_list = [];
      docs = await this.loadDocumentsJson(user.get_id())
      doc = null;
      for (var i_doc = 0; i_doc < docs.length; i_doc++){
        doc = new DocumentDto(
          docs[i_doc]["file_uploaded_b"],
          docs[i_doc]["name_s"],
          docs[i_doc]["url_s"],
          docs[i_doc]["created_at_dt"],
          docs[i_doc]["modified_at_dt"]
        )
        doc_list.push(doc)
      }
      console.log(`Docs for user ${user.get_name()}: ` + this.doc_list);
      user.set_documents(doc_list);
      this.user_list.push(user);
      
    }
  }

  loadUsersJson(){
    return this.User.get_remote_users();
  }

  loadDocumentsJson(user_id){
    return this.Document.get_remote_documents(user_id);
  }

  detached() {
    this.subscription.dispose();
  }

  logout(){
    this.error = null;
    this.auth_service.logout().then( data => {
      console.log(`Logout result is: ${data.success}`);
      this.ea.publish('user', null);
      this.router.navigateToRoute('home');
    }).catch(error => {
      this.error = error.message;
    });
  }

}
