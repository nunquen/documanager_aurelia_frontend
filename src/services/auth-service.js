import { inject } from 'aurelia-framework';
import { User } from "./user";

@inject(User)
export class AuthService{

    constructor(User){
        this.delay = 100;
        this.current_user = null;
        this.User = User;
        this.users = [];
    }

    loadUsersJson(){
        return this.User.get_remote_users();
    }

    async login(name){
        this.users = await this.User.get_remote_users();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                for (var i = 0; i < this.users.length; i++){
                    if (this.users[i].name == name){
                        this.current_user = this.users[i];
                        resolve({ user: this.users[i] });
                    }
                }
                reject(new Error('Invalid credentials!'));
            }, this.delay);
        });
    }

    logout(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.current_user = null;
                if (this.current_user){
                    reject(new Error('Error logging out'));
                } else {
                    resolve({ success: true });
                }
            }, this.delay);
        });
    }
}

