import { inject } from 'aurelia-framework';
import { HttpClient, json } from "../../node_modules/aurelia-fetch-client";
import moment from "../../node_modules/moment/moment";
import config_file from "../config";

@inject(HttpClient)
export class Document {
    constructor(HttpClient) {
        this.documents = null;
        this.httpClient = HttpClient;
        this.current_date = `${moment().format("YYYY-MM-DD")}`;

        HttpClient.configure(config =>{
            config.withBaseUrl(config_file.base_api_server_url);
        });
    }

    async get_remote_documents(user_id){
        return this.httpClient.fetch(`user/${user_id}/documents`)
            .then(async (response) => await (response.json()))
            .then(documents => {
                return JSON.parse(json(documents));
            })
            .catch(error => {
                console.log('Error retrieving documents.');
                return [];
            });
    }

    async get_remote_document_by_id(document_id){
        return this.httpClient.fetch(`document/${document_id}`)
            .then(async (response) => await (response.json()))
            .then(document => {
                return JSON.parse(json(document));
            })
            .catch(error => {
                console.log('Error retrieving single document.');
                return {};
            });
    }

    async post_remote_new_document(user_id, document_dto){
        var form = new FormData()
        form.append('user_id', user_id);
        form.append('file_path_s', document_dto.file_path);
        form.append('file_name_s', document_dto.file_name);
        form.append('file_type_s', document_dto.file_type);
        form.append('name_s', document_dto.name);
        form.append('url_s', document_dto.url);
        form.append('file_uploaded_b', document_dto.file_uploaded);
        
        const config = {
            headers: {
                "Accept": "/",
                "Content-Type": "multipart/form-data",
            },
        };
        return this.httpClient.fetch(`user/${user_id}/document`, {
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
                    if (response.status == 450 ) {
                        error_msg = "ERROR: Duplicated url";
                    }
                    if (response.status == 451 ) {
                        error_msg = "ERROR:  Duplicated file name";
                    }
                    return error_msg;
                }
            })
            .catch(error => {
                console.log(`Error posting document: ${error}`);
                return "ERROR_SEVERAL";
            });
    }
}