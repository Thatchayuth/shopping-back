import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    address_detail: string;

    @Column({ nullable: true })
    sub_district: Number;

    @Column({ nullable: true })
    district: Number;

    @Column({ nullable: true })
    province: Number;

    @Column({ nullable: true })
    postal_code: string;

    @ManyToOne(() => User, (user) => user.address, { onDelete: 'CASCADE' })
    user: User;
} 
