import { inject } from 'aurelia-framework';
import { HttpClient, json } from "../../node_modules/aurelia-fetch-client";
import moment from "../../node_modules/moment/moment";
import config_file from "../config";

@inject(HttpClient)
export class Revision {
    constructor(HttpClient) {
        this.revisions = null;
        this.httpClient = HttpClient;
        this.current_date = `${moment().format("YYYY-MM-DD")}`;

        HttpClient.configure(config =>{
            config.withBaseUrl(config_file.base_api_server_url);
        });
    }

    async get_remote_revisions(document_id){
        return this.httpClient.fetch(`document/${document_id}/revisions`)
            .then(async (response) => await (response.json()))
            .then(revisions => {
                return JSON.parse(json(revisions));
            })
            .catch(error => {
                console.log('Error retrieving revisions.');
                return [];
            });
    }

    async get_remote_revision_by_id(revision_id){
        return this.httpClient.fetch(`revision/${revision_id}`)
            .then(async (response) => await (response.json()))
            .then(revision => {
                return JSON.parse(json(revision));
            })
            .catch(error => {
                console.log('Error retrieving single revision.');
                return {};
            });
    }

    async post_remote_new_revision(document_id, revision_dto){
        var form = new FormData()
        form.append('document_id', document_id);
        form.append('file_path_s', revision_dto.file_path);
        form.append('file_name_s', revision_dto.file_name);
        form.append('file_type_s', revision_dto.file_type);
        form.append('local_full_path_s', revision_dto.local_full_path);
        form.append('title_s', revision_dto.title);
        form.append('comment_s', revision_dto.comment);
        form.append('file_uploaded_b', revision_dto.file_uploaded);
        
        const config = {
            headers: {
                "Accept": "/",
                "Content-Type": "multipart/form-data",
            },
        };
        return this.httpClient.fetch(`document/${document_id}/revision`, {
                method: 'post',
                body: form,
                headers: config
            })
            .then( response => { 
                // do whatever here
                if (response.status >= 200 && response.status < 300){
                    return "SUCCESS";
                } else {
                    console.log(`Error posting document: status_code is ${response.status}`);
                    var error_msg = "ERROR_GENERIC"
                    return error_msg;
                }
            })
            .catch(error => {
                console.log(`Error posting document: ${error}`);
                return "ERROR_SEVERAL";
            });
    }
}