import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from 'typeorm';


// Define an entity class
@Entity()
export class User {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryColumn()
  TaskId: number;

  @Column()
  TaskName: string;


//   @Column({ type: 'varchar', length: 30 })
//   name: string;

//   @Column({ type: 'varchar', length: 15 })
//   username: string;

//   @Column({ type: 'varchar', length: 40 })
//   email: string;

//   @Column({ type: 'int' })
//   age: number;

//   @Column({ type: 'varchar' })
//   password: string;

//   @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
//   /**
//    * m - male
//    * f - female
//    * u - unspecified
//    */
//   gender: string;
}

  
    
  
   
  