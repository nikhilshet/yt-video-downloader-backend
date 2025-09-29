import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor( private configService: ConfigService , private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request?.headers?.authorization?.split(' ')[1]
        if(token){
            try{
                const verify = await this.jwtService.verifyAsync(token , {secret:this.configService.get<string>('SECRET_KEY')})
                console.log(verify)
                request.user = {userId:verify.sub , userRole:verify.role}
                console.log(request.user)
            }catch(err){
                console.log(err)
                return false
            }
            return true
        }
        return false
    }
}