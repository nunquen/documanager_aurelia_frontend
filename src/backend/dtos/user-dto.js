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
}
