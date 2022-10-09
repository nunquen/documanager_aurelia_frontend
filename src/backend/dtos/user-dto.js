export class UserDto {
    id;
    name;
    activated;
    documents;

    constructor(user_id, user_name, user_password) {
        this.id = user_id;
        this.name = user_name;
        this.password = user_password;
        this.documents = [];
    }

    set_documents(documents){
        this.documents = documents;
    }

    get_documents(){
        return this.documents;
    }

    get_id(){
        return this.id;
    }

    get_name(){
        return this.name;
    }

    get_password(){
        return this.password;
    }
}
