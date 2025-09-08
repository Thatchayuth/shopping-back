/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthToken } from 'src/entity/auth-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthToken])],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
