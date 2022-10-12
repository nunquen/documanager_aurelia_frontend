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
            config.withBaseUrl(config_file.baseUrl);
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
}