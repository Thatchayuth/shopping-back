/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthToken } from './entity/auth-token.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { Address } from './entity/address.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'MyNewPass123!',
      database: 'Shopping',
      entities: [User, AuthToken, Address],
      synchronize: true,
      options: { encrypt: false },
    }),
    TypeOrmModule.forFeature([User, AuthToken, Address]),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // ให้ใช้ได้ทุก module โดยไม่ต้อง import ซ้ำ
    }),
    ],
  controllers: [AppController],
  providers: [AppService, AuthService],
 
})
export class AppModule { }
