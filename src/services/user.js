import { inject } from 'aurelia-framework';
import { HttpClient, json } from "../../node_modules/aurelia-fetch-client";
import moment from "../../node_modules/moment/moment";

@inject(HttpClient)
export class User {
    constructor(HttpClient) {
        this.users = null;
        this.httpClient = HttpClient;
        this.current_date = `${moment().format("YYYY-MM-DD")}`;
        
        const baseUrl = "http://localhost:8000/v1/";

        HttpClient.configure(config =>{
            config.withBaseUrl(baseUrl);
        });
    }

    async get_remote_users(){
        return this.httpClient.fetch("users")
            .then(async (response) => await (response.json()))
            .then(users => {
                return JSON.parse(json(users));
            })
            .catch(error => {
                console.error(error);
                return [];
            });
    }

}