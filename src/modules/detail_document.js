import { inject } from 'aurelia-framework';
import { Document } from "../services/document";
import { Revision } from "../services/revision";
import { DocumentDto } from '../backend/dtos/document-dto';
import { RevisionDto } from '../backend/dtos/revision-dto';
import { AuthService } from '../services/auth-service';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { UserHandler} from '../auth/user_handler';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(AuthService, EventAggregator, Router, Document, Revision, UserHandler)
export class DetailDocument {
  constructor(AuthService, EventAggregator, Router, Document, Revision, UserHandler){
    this.Document = Document;
    this.Revision = Revision;
    this.revision_list = [];
    this.auth_service = AuthService;
    this.router = Router;
    this.ea = EventAggregator;
    this.document = null;
    this.document_id = null;
    this.user_handler = UserHandler;
  }

  activate(params){
    this.document_id = params.document_id;
    console.log(`#DetailDocument.activate-> this.document_id: ${this.document_id}`);
  }
 
  async attached() {
    console.log(`detail_document.attached-> typeof user is ${typeof this.user_handler.user_name}`)
    if (typeof this.user_handler.user_name == 'object') {
      this.router.navigateToRoute('home');
      return;
    }

    var remote_doc = await this.loadDocumentByIdJson(this.document_id);
    this.document = new DocumentDto(
      remote_doc["id"],
      remote_doc["file_path_s"],
      remote_doc["file_name_s"],
      remote_doc["file_type_s"],
      remote_doc["name_s"],
      remote_doc["url_s"],
      remote_doc["file_uploaded_b"],
      remote_doc["created_at_dt"],
      remote_doc["modified_at_dt"],
      remote_doc["revisions_i"]
    )

    try{
      console.log(`DetailDocuments -> listing revisions for document: ${this.document.name}`);
    }catch(error){
      //If no user authenticated then redirect to home
      console.error(`DetailDocuments.attached->fail to get document name: ${error}`);
      this.router.navigateToRoute('home');
      return;
    }

    var revs = await this.loadRevisionsJson(this.document.id);
    var rev = null;

    for (var i_rev = 0; i_rev < revs.length; i_rev++){
      rev = new RevisionDto(
        revs[i_rev]["id"],
        revs[i_rev]["title_s"].length > 30 ? revs[i_rev]["title_s"].substr(0, 30) + "...": revs[i_rev]["title_s"],
        revs[i_rev]["comment_s"].length > 10 ? revs[i_rev]["comment_s"].substr(0, 10) + "...": revs[i_rev]["comment_s"],
        revs[i_rev]["number_i"],
        revs[i_rev]["file_name_s"],
        revs[i_rev]["file_type_s"],
        revs[i_rev]["local_full_path_s"],
        revs[i_rev]["file_uploaded_b"],
        revs[i_rev]["created_at_dt"],
        revs[i_rev]["modified_at_dt"],
      )
      this.document.revision_list.push(rev);
    }
  }

  async bind(){
  }

  revision_detail(document, revision){
    if (revision == null){
      this.router.navigateToRoute(`docs`, { url: document.url, version:"0", document_id: document.id});
    } else {
      this.router.navigateToRoute(`docs`, { url: document.url, version: revision.number, document_id: document.id});
    }
  }

  add_revision(document){
    this.router.navigateToRoute(`new_revision`, { document_id: document.id});
  }

  loadDocumentByIdJson(document_id){
    return this.Document.get_remote_document_by_id(document_id);
  }

  loadRevisionsJson(document_id){
    return this.Revision.get_remote_revisions(document_id);
  }

  detached() {
  }

}
