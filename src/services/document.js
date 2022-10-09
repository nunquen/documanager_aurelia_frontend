import { inject } from 'aurelia-framework';
import { HttpClient, json } from "../../node_modules/aurelia-fetch-client";
import moment from "../../node_modules/moment/moment";

@inject(HttpClient)
export class Document {
    constructor(HttpClient) {
        this.documents = null;
        this.httpClient = HttpClient;
        this.current_date = `${moment().format("YYYY-MM-DD")}`;
        
        const baseUrl = "http://localhost:8000/v1/";

        HttpClient.configure(config =>{
            config.withBaseUrl(baseUrl);
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

}