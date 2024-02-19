import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */

  /*
  
  */
 async  createUser(createUserDto: CreateUserDto) {
  try {
    const user: User =  new User();
    // user.name = createUserDto.name;
    // user.age = createUserDto.age;
    // user.email = createUserDto.email;
    // user.username = createUserDto.username;
    // user.password = createUserDto.password;
    // user.gender = createUserDto.gender;
    user.TaskName = createUserDto.TaskName;
    user.TaskId= createUserDto.TaskId;
    // if(user.TaskId)
    // {
    //   throw new BadRequestException('Creating a Duplicate User');
    // }

    
    const usertocreate = await this.userRepository.findOneBy({TaskId: user.TaskId});
    {
      if(usertocreate)
      {
        throw new BadRequestException('Creating a Duplicate User');
      }
    }

    return await this.userRepository.insert(user);
   // inserting so automatically throws error
  } catch (error) {
    console.log('error', error); // inserting a string in taskid=number
    throw new BadRequestException(error?.message)
  }
    
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param TaskId is type of number, which represent the id of user.
   * @returns promise of user
   */
   async viewUser(TaskId: number): Promise<User> {
    try{
      const usertoget = await this.userRepository.findOneBy({ TaskId});
    if(!usertoget)
    {
      throw new NotFoundException('No user found to view');
    }
    return await this.userRepository.findOneBy({ TaskId});
    }
    catch(error){
      console.log(error);
      throw new NotFoundException(error?.message);
    }
  }

  // async updateUser(id: number, name: string, email: string): Promise<User> {
  //   const userToUpdate = await this.userRepository.findOne(id);
  //   if (!userToUpdate) {
  //     throw new Error('User not found');
  //   }
  //   userToUpdate.name = name;
  //   userToUpdate.email = email;
  //   return await this.userRepository.save(userToUpdate);
  // }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param TaskId is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
   async updateUser(TaskId: number, updateUserDto: UpdateUserDto): Promise<User> {
    try{
      const userToUpdate = await this.userRepository.findOneBy({TaskId });
      if (!userToUpdate) {
        throw new NotFoundException('No user found to update');
      }
      userToUpdate.TaskName = updateUserDto.TaskName;
      //userToUpdate.TaskId=updateUserDto.TaskId;
      return await this.userRepository.save(userToUpdate);
    }catch(error)
    {
      console.log('error', error);
    throw new BadRequestException(error?.message);
    //()

    }

      // const user: User = new User();
    // user.TaskName = updateUserDto.TaskName;
    // user.TaskId = TaskId;
    // return this.userRepository.save(user);
     // user.name = updateUserDto.name;
    // user.age = updateUserDto.age;
    // user.email = updateUserDto.email;
    // user.username = updateUserDto.username;
    // user.password = updateUserDto.password;
    // user.id = id;
  }


  /**
   * this function is used to remove or delete user from database.
   * @param TaskId is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */


  
  
  
  
  //  async removeUser(TaskId: number): Promise<{ affected?: number }> {
  //   const usertodelete = await this.userRepository.findOneBy({TaskId});
  //   if(!usertodelete)
  //   {
  //     throw new  NotFoundException('No user found to delete');
  //   }
  //   return  await this.userRepository.delete(TaskId);
  // }




  


  
  async removeUser(TaskId: number): Promise<void> {
    try {
      const deleteResult = await this.userRepository.delete(TaskId);
      if (deleteResult.affected === 0) {
        throw new NotFoundException('No user found to delete');
      }
    } catch (error) {
      // if (error.name === 'QueryFailedError') {
      //   throw new NotFoundException('No user found to delete');
      // }
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }
}



  // async removeUser(TaskId: number): Promise<void> {
  //   const deleteResult = await this.userRepository.delete(TaskId);
  //   if (deleteResult.affected === 0) {
  //     throw new NotFoundException('No user found to delete');
  //   }
  // }






// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity'; // Assuming you have a User entity

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async createUser(name: string, email: string): Promise<User> {
//     const newUser = this.userRepository.create({ name, email });
//     return await this.userRepository.save(newUser);
//   }

//   async getAllUsers(): Promise<User[]> {
//     return await this.userRepository.find();
//   }

//   async getUserById(id: number): Promise<User> {
//     return await this.userRepository.findOne(id);
//   }

//   async updateUser(id: number, name: string, email: string): Promise<User> {
//     const userToUpdate = await this.userRepository.findOne(id);
//     if (!userToUpdate) {
//       throw new Error('User not found');
//     }
//     userToUpdate.name = name;
//     userToUpdate.email = email;
//     return await this.userRepository.save(userToUpdate);
//   }

//   async deleteUser(id: number): Promise<void> {
//     await this.userRepository.delete(id);
//   }
// }
