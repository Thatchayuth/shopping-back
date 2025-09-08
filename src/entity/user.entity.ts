/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AuthToken } from './auth-token.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // แนะนำให้เก็บแบบ hash (bcrypt)

  @OneToMany(() => AuthToken, (token) => token.user)
  tokens: AuthToken[];
}
