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
            config.withBaseUrl(config_file.baseUrl);
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

}