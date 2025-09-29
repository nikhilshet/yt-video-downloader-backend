import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService{

    private _userData

    constructor(){}

    get getUserData(){
        return this._userData
    }

    set setUserData(data){
        this._userData = data
    }
}