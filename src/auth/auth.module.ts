import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from "dotenv";
import { AuthGuard } from "./auth.guard";


@Module({
    imports:[
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory:async (configService: ConfigService)=>({
                secret:configService.get<string>('SECRET_KEY') ,
            }),
            global:true
        })
    ],
    controllers:[AuthController],
    providers:[AuthService],
    exports:[],
})

export class AuthModule{}