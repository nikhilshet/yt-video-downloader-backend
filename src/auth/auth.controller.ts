import { Body, Controller, Post, Req} from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import type { User } from "src/models/UserType";


@Controller('auth')
export class AuthController{

    constructor(private authService:AuthService){}

    @Post('/login')
    login(@Body() data:any , @Req() request: Request){
    }   
    
    @Post('/register')
    register(@Body() data : User , @Req() request: Request){
        return this.authService.register(data)
    }
    
}