
import { Document } from "./services/document";
import { Index } from "./index";
import { inject } from 'aurelia-framework';
import { ListDocuments } from './modules/list_documents'
import { NewDocument } from './modules/new_document'
import { NewRevision } from './modules/new_revision'
import { Doc } from "./modules/doc";
import { DetailDocument } from './modules/detail_document'
import { moment } from "../node_modules/moment/moment";
import { User } from "./services/user";
import { DocumentDto } from './backend/dtos/document-dto';
import { UserDto } from './backend/dtos/user-dto';
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
    config.options.pushState = true;
    
    config.map([
      { route: '', name: 'home', moduleId:'index', title:'Home' },
      { route: 'login', name: 'login', moduleId:'auth/login', title:'Login' },
      { route: 'logout', name: 'logout', moduleId:'auth/logout', title:'Logout' },
      { route: 'list_documents', name: 'list_documents', moduleId:'modules/list_documents', title:'List Documents' },
      { route: 'docs/:url', name: 'docs', moduleId:'modules/doc', title:'View Documents' },
      { route: 'detail_document', name: 'detail_document', moduleId:'modules/detail_document', title:'Document detail' },
      { route: 'new_document', name: 'new_document', moduleId:'modules/new_document', title:'New Document' },
      { route: 'new_revision', name: 'new_revision', moduleId:'modules/new_revision', title:'New Revision' },
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
      user = new UserDto(
        this.users[i]["id"],
        this.users[i]["name"],
        this.users[i]["password"]);

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
