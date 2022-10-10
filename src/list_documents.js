import { Todo, TODO } from "./propylon/entity/todo";
import { inject } from 'aurelia-framework';
import { Document } from "./services/document";
import { User } from "./services/user";
import { UserDto } from './backend/dtos/user-dto';
import { DocumentDto } from './backend/dtos/document-dto';
import { AuthService } from './services/auth-service';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(AuthService, EventAggregator, Router, User, Document)
export class ListDocuments {
  constructor(AuthService, EventAggregator, Router, User, Document){
    this.Document = Document;
    this.document_list = [];
    this.auth_service = AuthService;
    this.router = Router;
    this.ea = EventAggregator;
  }
  
  async attached() {
    this.current_user = this.auth_service.current_user;
    // Subscribing to published user
    try{
      this.subscription = this.ea.subscribe('user', user => {
        this.current_user = this.auth_service.current_user;
    })} catch(error) {
      console.error(`ListDocuments.attached: ${error}`);
    }
    
    try{
      console.log(`ListDocuments -> listing documents for user: ${this.current_user.name}`);
    }catch(error){
      //If no user authenticated then redirect to home
      this.router.navigateToRoute('home');
      return;
    }
    
    var docs = await this.loadDocumentsJson(this.current_user.id);
    var doc = null;

    for (var i_doc = 0; i_doc < docs.length; i_doc++){
      doc = new DocumentDto(
        docs[i_doc]["file_uploaded_b"],
        docs[i_doc]["name_s"],
        docs[i_doc]["url_s"],
        docs[i_doc]["created_at_dt"],
        docs[i_doc]["modified_at_dt"]
      )
      this.document_list.push(doc)
    }
    console.log(`ListDocuments -> Docs for user ${this.current_user.name}: ${this.document_list.length} docs`);
    this.current_user.documents = this.document_list;
    this.ea.publish("user", this.current_user);
    console.log(`ListDocuments -> USer published with documents`);
  }

  async bind(){
  }

  detached() {
    this.subscription.dispose();
  }


  document_detail(document){
    console.log(`document_detail-> ${document.name}`);
  }

  removeTodo(todo){
    if (todo.done){
      this.todoList.splice(this.todoList.indexOf(todo), 1);
    }
  }

  loadDocumentsJson(user_id){
    return this.Document.get_remote_documents(user_id);
  }

  detached() {
    this.subscription.dispose();
  }
}