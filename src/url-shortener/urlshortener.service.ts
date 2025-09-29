import { Injectable } from "@nestjs/common";
import { Response } from "express";
import { nanoid } from "nanoid";
import { Neo4jService } from "nest-neo4j/dist";
import {v4 as uuidv4} from 'uuid'

@Injectable()
export class UrlShortenerService{
    constructor(private neo4jService: Neo4jService){}

    async generarteShortUrl(data , request){
        const nanoId = nanoid(6);
        const relationId = uuidv4();
        console.log("comingn here" , data, request.user.userId , "users")
        const createUrl = await this.neo4jService.write(`Match(n:User{userId:$userId}) , 
            (a:Url) create (n)-[r:HAS_SHORTENED]->(a) 
            set r.originalUrl = $originalUrl , r.nanoId = $nanoId , r.relationId = $relationId
            return r` , {userId:request.user.userId , originalUrl:data.url , nanoId:nanoId , relationId:relationId})
        return createUrl.records[0].get('r').properties
    }

    async getOriginalUrl(param , request , response:Response){
        console.log(param , request.user.userId , "users")
        const result = await this.neo4jService.read(`Match(n:User{userId:$userId})-[r:HAS_SHORTENED{nanoId:$nanoId}]->(u:Url) return r
            `, {userId:request.user.userId , nanoId:param })
        
        if(result.records.length > 0){
            const relationData = result.records[0].get('r').properties
             response.status(301).redirect(relationData.originalUrl)
        }else{
            response.status(403).send("No Such Url")
        }
    }
    
}