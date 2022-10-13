import { inject } from 'aurelia-framework';
import config_file from "../config";
import { Document } from "../services/document";
import { DocumentDto } from '../backend/dtos/document-dto';
import { UserDto } from '../backend/dtos/user-dto';
import { AuthService } from '../services/auth-service';
import { Router } from 'aurelia-router';
import { UserHandler} from '../auth/user_handler';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(AuthService, Router, Document, UserHandler)
export class NewDocument {
  constructor(AuthService, Router, Document, UserHandler) {
    this.Document = Document;
    this.auth_service = AuthService;
    this.router = Router;
    this.document = new DocumentDto();
    this.document_file = null;
    this.user_handler = UserHandler;
  }

  attached() {
    if (this.user_handler.user_name+"" == "" ) {
      this.router.navigateToRoute('home');
      return;
    }
  }

  fileSelected(selected_files) {
    let reader = new FileReader();
    let local_file = selected_files[0];
    reader.readAsDataURL(local_file);
    reader.onload = () => {
      this.document_file = reader.result;
    };
    console.log(`NewDocument.fileSelected -> document_file: ${document_file.files.length}`);

    this.document_file = document_file.files[0];
    this.document.name = this.name;
    this.document.url = this.url;
    //url treatment: removing heading "/" and replacing \ characters if any
    if (this.document.url.startsWith("/")) {
      this.document.url = this.document.url.substring(1);
      this.document.url = this.document.url.replaceAll("\\", "/");
    }
    this.document.file_name = this.document_file.name;
    this.document.file_type = this.document_file.type;
    this.document.file_uploaded = this.document_file;

    console.log(`NewDocument.fileSelected -> name: ${this.document.file_name}`);
    console.log(`NewDocument.fileSelected -> type: ${this.document.file_type}`);
    console.log(`NewDocument.fileSelected -> file_uploaded: ${this.document.file_uploaded}`);
  }

  async create(){
    this.error_send = null;
    this.success_send = null;
    this.warning_send = null;

    if(this.name == null){
      this.warning_send = "You must name the document";
      this.error_send = null;
      this.success_send = null;
      return
    }

    if(this.url == null){
      this.warning_send = "You must define a url to publish your document";
      this.error_send = null;
      this.success_send = null;
      return
    }

    if(this.document.file_uploaded == null){
      this.warning_send = "You must select a file";
      this.error_send = null;
      this.success_send = null;
      return
    }

    console.log(`Sending File: ${this.document.file_uploaded.name}`);

    var res = await this.sendNewDocument(this.user_handler.user_id, this.document);

    this.success_send = res == "SUCCESS" ? "Document successfully sent!": null;
    this.error_send = res.startsWith("ERROR") ? res: null;

    // Cleaning the form
    if (this.error_send == null && this.success_send != null){
      this.name = "";
      this.url = "";
      this.file = "";
    }
  }

  async sendNewDocument(user_id, document_dto){
    return await this.Document.post_remote_new_document(user_id, document_dto);
  }
  
}
