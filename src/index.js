import { UserHandler } from './auth/user_handler';
import { inject } from 'aurelia-framework';

@inject (UserHandler)
export class Index { 
    constructor(UserHandler){
        this.user_handler = UserHandler;
    }
}