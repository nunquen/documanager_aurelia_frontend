import { inject } from 'aurelia-framework';
import { HttpClient, json } from "../../node_modules/aurelia-fetch-client";
import moment from "../../node_modules/moment/moment";
import config_file from "../config";

@inject(HttpClient)
export class User {
    constructor(HttpClient) {
        this.users = null;
        this.httpClient = HttpClient;
        this.current_date = `${moment().format("YYYY-MM-DD")}`;

        HttpClient.configure(config =>{
            config.withBaseUrl(config_file.base_api_server_url);
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