import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Neo4jModule } from 'nest-neo4j/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UrlShortenerModule } from './url-shortener/urlshortener.module';
import { UserService } from './services/user.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:['dev.env'],
      isGlobal:true,
    }),
    Neo4jModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        scheme: 'neo4j+s',
        host: '2ad8b742.databases.neo4j.io',
        port: 7687,
        username: config.get<string>('NEO4J_USERNAME'),
        password: config.get<string>('NEO4J_PASSWORD'),
        database: config.get<string>('NEO4J_DATABASE')
      })
    }),
    AuthModule,
    UrlShortenerModule
  ],
  controllers: [AppController],
  providers: [AppService , UserService],
})
export class AppModule {}
