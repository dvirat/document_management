import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from '../../documents/entity/document.entity';

export enum UserRole {
  REGULAR = 'Regular User', 
  ADMIN = 'Admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'text', default: UserRole.REGULAR })
  role!: UserRole;

  @OneToMany(() => Document, (document) => document.owner)
  documents!: Document[];
}
