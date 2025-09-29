import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Neo4jService } from "nest-neo4j/dist";
import { login } from "src/models/LoginType";
import { User } from "src/models/UserType";
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService{
constructor(private neo4jService: Neo4jService , private jwtService: JwtService){}

async register(body:User){
    console.log(body)
    const properties:User = {
        ...body,
        userId:uuidv4(),
    }
    console.log(properties , "pproperties")

    const checkIfUserExists = await this.neo4jService.read(`Match (u:User) where u.phone = $phone OR u.emailId = $emailId return u` , 
        {phone:properties.phone , emailId:properties.emailId}
    )
    
    if(checkIfUserExists.records.length > 0){
        return "User already present with this credentials"
    }

    const result = await this.neo4jService.write(`Create (u:User) set u = $props return u`,
         {props:properties})
    return result.records[0].get('u').properties
}

async login(body:login){
    
    const loginObj = {
        emailId : body.emailId ? body.emailId : "",
        phone : body.phone ? body.phone : ""
    }
    console.log(loginObj , "--------")
    const login = await this.neo4jService.read(`Match (u:User) where u.emailId = $emailId OR u.phone = $phone return u` , 
        {emailId:loginObj.emailId , phone:loginObj.phone}
    )
    if(login.records.length > 0){
        const userObj:User = login.records[0].get('u').properties
        console.log(userObj , "User obj")
        if(userObj.password == body.password){
            const jwtPayload = {sub:userObj.userId , role:userObj.userType , iat:Math.floor(Date.now()/1000) , exp: Math.floor(Date.now() / 1000) + (60 * 15)}
            const access_token = await this.jwtService.signAsync(jwtPayload)
            return access_token
        }else{
            return "Password is Incorrect"
        }
    }else{
        return `No such user exists with this ${loginObj.emailId ? "email Id" : "phone number"}`
    }
}

}
