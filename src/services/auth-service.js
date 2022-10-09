export class AuthService{

    constructor(){
        this.delay = 100;
        this.current_user = null;
        this.users = ["Gemma", "Brendan", "Saul"];
    }

    login(name){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // TODO: get remote users
                if (this.users.includes(name)){
                    this.current_user = name;
                    // TODO: return user dto
                    resolve({ user: name });
                } else {
                    reject(new Error('Invalid credentials!'));
                }
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

