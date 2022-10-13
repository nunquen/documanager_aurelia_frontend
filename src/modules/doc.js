import { inject } from 'aurelia-framework';
import config_file from "../config";
import { Document } from "../services/document";
import { Revision } from "../services/revision";
import { DocumentDto } from '../backend/dtos/document-dto';
import { RevisionDto } from '../backend/dtos/revision-dto';
import { AuthService } from '../services/auth-service';
import { Router } from 'aurelia-router';
import { UserHandler} from '../auth/user_handler';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(AuthService, Router, Document, Revision, UserHandler)
export class Doc {
    constructor(AuthService, Router, Document, Revision, UserHandler){
        this.Document = Document;
        this.Revision = Revision;
        this.auth_service = AuthService;
        this.router = Router;
        this.document = null;
        this.revision = null;
        this.show_document = true;
        this.baseUrl = config_file.base_server_url;
        this.revision_error = null;
        this.user_handler = UserHandler;
    }
    
    activate(params) {
        this.url = params.url;
        this.version = params.version;
        this.document_id = params.document_id;
    }

    async attached() {
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

        if (this.version == "0"){
            return;
        }

        this.show_document = false;

        var revs = await this.loadRevisionsJson(this.document_id);
        var rev = null;

        console.log(`Retrieving ${revs.lenght} docs for scrapping`);

        for (var i_rev = 0; i_rev < revs.length; i_rev++){
            if (revs[i_rev]["number_i"] == this.version){
                rev = new RevisionDto(
                    revs[i_rev]["id"],
                    revs[i_rev]["title_s"],
                    revs[i_rev]["comment_s"],
                    revs[i_rev]["number_i"],
                    revs[i_rev]["file_name_s"],
                    revs[i_rev]["file_type_s"],
                    revs[i_rev]["local_full_path_s"],
                    revs[i_rev]["file_uploaded_b"],
                    revs[i_rev]["created_at_dt"],
                    revs[i_rev]["modified_at_dt"],
                )
            }
        }

        this.revision = rev;
        if (this.revision == null){
            this.revision_error = "The revision couldn't be retrieved.";
        }
    }

    async bind(){
        this.show_revision = false;
    }

    loadDocumentByIdJson(document_id){
        return this.Document.get_remote_document_by_id(document_id);
    }

    loadRevisionsJson(document_id){
        return this.Revision.get_remote_revisions(document_id);
    }
}
