import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('inserted User with Id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated User with Id ', this.id);
  }

  @BeforeRemove()
  logRemove() {
    console.log('removed User with Id ', this.id);
  }
}
