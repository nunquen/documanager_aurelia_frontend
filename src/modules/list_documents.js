import { inject } from 'aurelia-framework';
import { Document } from "../services/document";
import { User } from "../services/user";
import { DocumentDto } from '../backend/dtos/document-dto';
import { AuthService } from '../services/auth-service';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserHandler} from '../auth/user_handler';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(AuthService, EventAggregator, Router, User, Document, UserHandler)
export class ListDocuments {
  constructor(AuthService, EventAggregator, Router, User, Document, UserHandler){
    this.Document = Document;
    this.document_list = [];
    this.auth_service = AuthService;
    this.router = Router;
    this.ea = EventAggregator;
    this.user_handler = UserHandler;
  }
  
  async attached() {
    console.log(`ListDocuments.attached -> user_name: ${this.user_handler.user_name}`);
    if (this.user_handler.user_name == "" || this.user_handler.user_name ==  null) {
      this.router.navigateToRoute('home');
      return;
    }

    var docs = await this.loadDocumentsJson(this.user_handler.user_id);
    var doc = null;

    for (var i_doc = 0; i_doc < docs.length; i_doc++){
      doc = new DocumentDto(
        docs[i_doc]["id"],
        docs[i_doc]["file_path_s"],
        docs[i_doc]["file_name_s"],
        docs[i_doc]["file_type_s"],
        docs[i_doc]["name_s"],
        docs[i_doc]["url_s"],
        docs[i_doc]["file_uploaded_b"],
        docs[i_doc]["created_at_dt"],
        docs[i_doc]["modified_at_dt"],
        docs[i_doc]["revisions_i"]
      )

      console.log(`Document "${docs.name}" has ${doc.revisions} revisions`);
      this.document_list.push(doc);
    }

    console.log(`ListDocuments -> Docs for user ${this.user_handler.user_name}: ${this.document_list.length} docs`);
  }

  async bind(){
  }

  document_detail(document){
    this.router.navigateToRoute(`detail_document/${document.id}`);
  }

  add_document(current_user){
    this.router.navigateToRoute(`new_document`);
  }

  loadDocumentsJson(user_id){
    return this.Document.get_remote_documents(user_id);
  }

  detached() {
  }
}