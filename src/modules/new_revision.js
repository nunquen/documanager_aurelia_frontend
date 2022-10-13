import { inject } from 'aurelia-framework';
import config_file from "../config";
import { Revision } from "../services/revision";
import { RevisionDto } from '../backend/dtos/revision-dto';
import { UserDto } from '../backend/dtos/user-dto';
import { AuthService } from '../services/auth-service';
import { Router } from 'aurelia-router';

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap');

@inject(AuthService, Router, Revision)
export class NewRevision {
  constructor(AuthService, Router, Revision) {
    this.current_user = null;
    this.Revision = Revision;
    this.auth_service = AuthService;
    this.router = Router;
    this.revision = new RevisionDto();
    this.revision_file = null;
  }

    fileSelected(selected_files) {
        let reader = new FileReader();
        let local_file = selected_files[0];
        reader.readAsDataURL(local_file);
        reader.onload = () => {
            this.revision_file = reader.result;
        };
        console.log(`NewRevision.fileSelected -> revision_file: ${revision_file.files.length}`);

        this.revision_file = revision_file.files[0];
        this.revision.title = this.title;
        this.revision.comment = this.comment;
        this.revision.file_name = this.revision_file.name;
        this.revision.file_type = this.revision_file.type;
        this.revision.file_uploaded = this.revision_file;
        this.revision.local_full_path = "";

        console.log(`NewRevision.fileSelected -> name: ${this.revision.file_name}`);
        console.log(`NewRevision.fileSelected -> type: ${this.revision.file_type}`);
        console.log(`NewRevision.fileSelected -> file_uploaded: ${this.revision.file_uploaded}`);
        
    }

    activate(params) {
        this.document_id = params.document_id;
    }

    async create(){
        this.error_send = null;
        this.success_send = null;
        this.warning_send = null;

        if(this.title == null){
            this.warning_send = "You must title the revision";
            this.error_send = null;
            this.success_send = null;
            return
        }

        if(this.comment == null){
            this.warning_send = "Please, add a comment to this revision";
            this.error_send = null;
            this.success_send = null;
            return
        }

        if(this.file == null){
            this.warning_send = "You must select a file";
            this.error_send = null;
            this.success_send = null;
            return
        }

        var res = await this.sendNewRevision(this.document_id, this.revision);

        this.success_send = res == "SUCCESS" ? "Revision successfully sent!": null;
        this.error_send = res.startsWith("ERROR") ? res: null;

        // Cleaning the form
        if (this.error_send == null && this.success_send != null){
            this.title = "";
            this.comment = "";
            this.file = "";
        }
    }

    async sendNewRevision(document_id, revision_dto){
        return await this.Revision.post_remote_new_revision(document_id, revision_dto);
    }
}