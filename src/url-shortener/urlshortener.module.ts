import { Module } from "@nestjs/common";
import { UrlShortenerController } from "./urlshortener.controller";
import { UrlShortenerService } from "./urlshortener.service";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports:[],
    controllers:[UrlShortenerController],
    providers:[UrlShortenerService],
    exports:[UrlShortenerService]
})

export class UrlShortenerModule {

}