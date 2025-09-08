/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthToken } from './entity/auth-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'MyNewPass123!',
      database: 'Shopping',
      entities: [User, AuthToken],
      synchronize: true,
      options: { encrypt: false },
    }),
    TypeOrmModule.forFeature([User, AuthToken]),AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
