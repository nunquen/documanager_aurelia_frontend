export class UserDto {
    id;
    name;
    activated;
    documents;

    constructor(user_id=null, user_name=null, user_password=null) {
        this.id = user_id;
        this.name = user_name;
        this.password = user_password;
        this.documents = [];
    }
}
