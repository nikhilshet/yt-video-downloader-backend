import { Injectable } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { User } from "src/models/UserType";
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService{
constructor(private neo4jService: Neo4jService){}

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

}
