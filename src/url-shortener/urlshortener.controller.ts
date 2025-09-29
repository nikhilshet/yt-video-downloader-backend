import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import type { url } from "src/models/UrlType";
import { UrlShortenerService } from "./urlshortener.service";
import type { Request, Response } from 'express';

@Controller('')
export class UrlShortenerController{
    constructor(private urlshortenerService:  UrlShortenerService){}

    @UseGuards(AuthGuard)
    @Post('create-url')
    postUrl(@Body() data:url , @Req() request :Request){
        return this.urlshortenerService.generarteShortUrl(data , request)
    }

    @UseGuards(AuthGuard)
    @HttpCode(204)
    @Post('/:id')
    getOriginalUrl(@Param('id') id:string , @Req() request:Request , @Res() response: Response){
        return this.urlshortenerService.getOriginalUrl(id , request , response)
    }
}