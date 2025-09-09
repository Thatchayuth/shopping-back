/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { AuthToken } from './auth-token.entity';
import { Address } from './address.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string; // สำหรับ email/password login (hash ด้วย bcrypt)

  // สำหรับ Google login
  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  facebookId: string;

  @OneToMany(() => AuthToken, (token) => token.user)
  tokens: AuthToken[];
  
  @OneToMany(() => Address, (address) => address.user)
  address: Address[];
}
