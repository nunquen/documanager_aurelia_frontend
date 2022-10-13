import { UserDto } from "../backend/dtos/user-dto";

export class UserHandler{
    user_name;
    user_id;
    password;
    constructor(){
        this.user_name = null;
        this.user_id = null;
        this.password = null;
    }
}