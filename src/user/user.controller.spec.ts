import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InsertResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';


import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';




describe('UserController', () => {
  let controller: UserController;
  let service :UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController,],
      providers: [UserService,{
        provide: getRepositoryToken(User),
        useValue :{
          
          delete: jest.fn(),
          save: jest.fn(),
          insert: jest.fn(),
          findOneBy : jest.fn(),


        },
      }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });



  

// Define mock user data with the correct type
const mockUserData: CreateUserDto = {
  TaskId: 1, // Assuming TaskId should be a number
  TaskName: 'klub'
};

describe('createUser', () => {
  it('should create a user when valid data is provided', async () => {
    // Mock the service method to return an InsertResult
    const mockInsertResult: InsertResult = {  identifiers: [],raw: {}, generatedMaps: [] };

    jest.spyOn(service, 'createUser').mockResolvedValue(mockInsertResult);

    // Call the controller method with mock user data
    const result = await controller.create(mockUserData);

    // Assert the result
    expect(result).toEqual(mockInsertResult);
  });
});

  

const mockUpdateData: UpdateUserDto = {
  TaskId: 1, // Assuming TaskId should be a number
  TaskName: 'updatedName'
};

describe('updateUser', () => {
  it('should update a user when valid data is provided', async () => {
    // Mock the service method to return a User object
    const mockUpdatedUser: User = {
      TaskId: mockUpdateData.TaskId,
      TaskName: mockUpdateData.TaskName
      // Add other properties as needed
    };

    jest.spyOn(service, 'updateUser').mockResolvedValue(mockUpdatedUser);

    // Call the controller method with mock user data
    const result = await controller.update('1', mockUpdateData);

    // Assert the result
    expect(result).toEqual(mockUpdatedUser);
  });
});

describe('remove', () => {
  it('should call removeUser method of the UserService', async () => {
    const removeUserSpy = jest.spyOn(service, 'removeUser').mockResolvedValue();

    await controller.remove(1);

    expect(removeUserSpy).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if UserService throws NotFoundException', async () => {
    jest.spyOn(service, 'removeUser').mockRejectedValue(new NotFoundException('User not found'));

    await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
  });
});
});

  
  
//     describe('removeUser', () => {
//       it('should delete a user when valid id are provided', async () => {
//          jest.spyOn(service, 'removeUser').mockResolvedValue(undefined);
  
//         // Call the controller method
//         const result = await controller.remove(1);
        
  
//         // Assert the result
//         expect(result).toBeUndefined();
       
//       });
  
//       it('should throw an error if user with provided id and name does not exist', async () => {
//         // Mock the service method to throw an error
//        //jest.spyOn(service, 'removeUser').mockRejectedValue(new Error('User not found'));
//         jest.spyOn(service, 'removeUser').mockImplementation(async (TaskId: number) => {
//           throw new Error('User not found');
//         });
  
//         // Call the controller method and expect it to throw
//         await expect(controller.remove(999)).rejects.toThrow('User not found');
        
//       });
//     });
//   });



  



// describe('removeUser', () => {
//   it('should remove a user with valid id', async () => {
//     const taskId = 1;

//     // Mock the userService.removeUser method to return a successful response
//     jest.spyOn(service, 'removeUser').mockResolvedValue();

//     // Call the removeUser method on the controller
//     await controller.remove(taskId);

//     // Expect the removeUser method of userService to be called with the correct taskId
//     expect(service.removeUser).toHaveBeenCalledWith(taskId);
//   });

//   it('should throw NotFoundException when user is not found', async () => {
//     const taskId = 999;

//     // Mock the userService.removeUser method to throw NotFoundException
//     jest.spyOn(service, 'removeUser').mockRejectedValue(new NotFoundException());

//     // Call the removeUser method on the controller and expect it to throw NotFoundException
//     await expect(controller.remove(taskId)).rejects.toThrow(NotFoundException);
//   });
// });
// });





//   import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';

// import { AppModule } from 'src/app.module';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';




// describe('UserController', () => {
//   let controller: UserController;
//   let service :UserService;

//   // const mockUserService ={
//   //   create: jest.fn(dto => {
//   //     return {
//   //       TaskId: Date.now(),
//   //       ...dto
//   //     };
//   //   }),
//   //   update: jest.fn().mockImplementation((TaskId,dto) =>({
//   //     TaskId,
//   //     ...dto
//   //   })), 

//   // };


//     beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController,],
//       providers: [UserService,{
//         provide: getRepositoryToken(User),
//         useValue :{
          
//             delete: jest.fn(),
//           // save: jest.fn(),
//           // insert: jest.fn(),
//           // delete: jest.fn(),
//           // findOneBy : jest.fn(),


//         },
//       }],
//     }).compile();

//   // beforeEach(async () => {
//   //   const module: TestingModule = await Test.createTestingModule({
//   //     controllers: [UserController],
//   //     providers: [UserService],
//   //   })
//   //   .overrideProvider(UserService)
//   //   .useValue(mockUserService)
//   //   .compile();

//   //   providers: [UserService,
//   //     {
//   //     provide: getRepositoryToken(User),
//   //     useValue : mockUserService,
//   //     },
//   //   ],
//   // }).compile();

//     controller = module.get<UserController>(UserController);
//     service = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });



//   //TEST CASE FOR CREATE
//   it('should create a task',() => {
//     const dto = {TaskId: 1 ,TaskName: 'klub' };
//     expect( controller.create(dto)).toEqual({
//       TaskId: dto.TaskId,
//       TaskName: dto.TaskName,
//     });

//     expect(controller.create).toHaveBeenCalledWith(dto);
//   });


//   //TEST CASE FOR UPDATE
//   it('should update the task',() => {
//     const dto = {TaskId: 1 ,TaskName: 'klub' };
//     expect(controller.update('1',dto)).toEqual({
//       TaskId:1,
//       ...dto,
//     });
//     expect(controller.update).toHaveBeenCalled();

//   });


  
  




  
  
//     describe('removeUser', () => {
//       it('should delete a user when valid id are provided', async () => {
//         // Mock the service method to return a value (e.g., success message)
//         //const successMessage = 'User deleted successfully';
//        // const successMessage: Promise<{ affected?: number; }> = Promise.resolve({ affected: 200 });
//         jest.spyOn(service, 'removeUser').mockResolvedValue({ affected: 1});
  
//         // Call the controller method
//         const result = await controller.remove(1);
//         console.log(result);
  
//         // Assert the result
//         expect(result).toEqual({ affected: 1});
//         console.log('success');
//       });
  
//       it('should throw an error if user with provided id and name does not exist', async () => {
//         // Mock the service method to throw an error
        
//         //jest.spyOn(service, 'removeUser').mockRejectedValue(new Error('User not found'));
//         jest.spyOn(service, 'removeUser').mockImplementation(async (TaskId: number) => {
//           throw new Error('User not found');
//         });
  
//         // Call the controller method and expect it to throw
//         await expect(controller.remove(999)).rejects.toThrow('User not found');
//         console.log('fail');
//       });
//     });
//   });
  


