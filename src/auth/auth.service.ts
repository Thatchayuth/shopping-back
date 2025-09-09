/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuthToken } from 'src/entity/auth-token.entity';
import { User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(AuthToken) private readonly tokenRepo: Repository<AuthToken>,
    private readonly jwtService: JwtService,
  ) {}

  // Register
  async register(email: string, password: string) {
    console.log('Register request:', { email, password });

    if (await this.isUserExists(email)) {
      throw new BadRequestException('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashed });
    return this.userRepo.save(user);
  }

  async isUserExists(email: string): Promise<boolean> {
  const user = await this.userRepo.findOne({ where: { email } });
  return !!user; // true = user มีอยู่แล้ว
}

  // Login
  async login(email: string, password: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = randomBytes(32).toString('hex');
    const expireAt = new Date(Date.now() + 1000 * 60 * 60); // 1 ชั่วโมง

    const authToken = this.tokenRepo.create({ token, expireAt, user });
    await this.tokenRepo.save(authToken);

    return { token, expireAt };
  }

  // Validate
  async validateToken(token: string) {
    const authToken = await this.tokenRepo.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!authToken) throw new UnauthorizedException('Token not found');
    if (authToken.expireAt < new Date())
      throw new UnauthorizedException('Token expired');

    return authToken.user;
  }

  async googleLogin(profile: any) {
  const { email, name, sub: googleId, picture: avatar } = profile;

  let user = await this.userRepo.findOne({ where: { googleId } });

  if (!user) {
    user = this.userRepo.create({ email, name, googleId, avatar });
    await this.userRepo.save(user);
  }

  // generate JWT token
  const token = this.jwtService.sign({ userId: user.id, email: user.email });
  return { token, user };
}

async loginWithFacebook(accessToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`
  );
  const profile = await response.json();

  if (!profile || profile.error) {
    throw new UnauthorizedException('Invalid Facebook token');
  }

  // ค้นหา user หรือสร้างใหม่
  let user = await this.userRepo.findOne({ where: { facebookId: profile.id } });
  if (!user) {
    user = this.userRepo.create({
      facebookId: profile.id,
      email: profile.email,
      name: profile.name,
    });
    await this.userRepo.save(user);
  }

  // ออก JWT
  const payload = { sub: user.id, email: user.email };
  return {
    access_token: this.jwtService.sign(payload),
  };
}

  // Logout
  async logout(token: string) {
    await this.tokenRepo.delete({ token });
    return { message: 'Logged out' };
  }
}
