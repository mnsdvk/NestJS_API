// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UserService,{
//         provide: getRepositoryToken(User),
//         useValue :{
//           save: jest.fn(),
//           insert: jest.fn(),
//           delete: jest.fn(),
//           findOneBy : jest.fn(),


//         },
//       }],
//     }).compile();

//     service = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: any; // Mocked repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            insert: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(), 
            findOneBy: jest.fn(),// Assuming findOne method instead of findOneBy
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<any>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user when valid data is provided', async () => {
      const userData = {
        TaskId: 1,
        TaskName: 'klub',
      };
      const mockUser: User = { ...userData, TaskId: 1 };

      userRepository.insert.mockResolvedValue(mockUser);

      const result = await service.createUser(userData);

      expect(result).toEqual(mockUser);
    });
  });







  describe('updateUser', () => {
    it('should update a user when valid data is provided', async () => {
      // Mock data
      const updateUserDto = { TaskName: 'Updated TaskName' };
      const existingUser = { TaskId: 1, TaskName: 'Existing TaskName' };

      // Mock the findOneBy method of userRepository to return the existing user
      userRepository.findOneBy.mockResolvedValue(existingUser);

      // Mock the save method of userRepository to return the updated user
      userRepository.save.mockImplementation(async (user: User) => user);

      // Call the updateUser method
      const result = await service.updateUser(existingUser.TaskId, updateUserDto);

      // Assert the result
      expect(result).toEqual({
        TaskId: existingUser.TaskId,
        TaskName: updateUserDto.TaskName,
      });
    });

    it('should throw a NotFoundException if user with provided TaskId does not exist', async () => {
      // Mock data
      const updateUserDto = { TaskName: 'Updated TaskName' };

      // Mock the findOneBy method of userRepository to return null (user not found)
      userRepository.findOneBy.mockResolvedValue(null);

      // Call the updateUser method and expect it to throw a NotFoundException
      await expect(service.updateUser(999, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });


  describe('removeUser', () => {
    it('should delete a user when valid id is provided', async () => {
      const deleteResult = { affected: 1 };
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);

      await expect(service.removeUser(1)).resolves.toBeUndefined();
      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no user found to delete', async () => {
      const deleteResult = { affected: 0 };
      jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResult);

      await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if query failed', async () => {
      jest.spyOn(userRepository, 'delete').mockRejectedValue({ name: 'QueryFailedError' });

      await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
    });
  });
});
  // describe('removeUser', () => {
  //   it('should delete a user when valid TaskId is provided', async () => {
  //     const TaskId = 1;

  //     // Mocking the findOneBy method to return a user
  //     jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ TaskId: 1 });

  //     // Mocking the delete method of the repository to return a dummy value
  //     const mockDeleteResult = { affected: 1 };
  //     jest.spyOn(userRepository, 'delete').mockResolvedValue(mockDeleteResult);

  //     // Call the removeUser method
  //     const result = await service.removeUser(TaskId);

  //     // Assert that the delete method of the repository was called with the correct TaskId
  //     expect(userRepository.delete).toHaveBeenCalledWith(TaskId);

  //     // Assert that the result matches the expected value
  //     expect(result).toEqual(mockDeleteResult);
  //   });

  //   it('should throw NotFoundException if no user with the provided TaskId is found', async () => {
  //     const TaskId = 1;

  //     // Mocking the findOneBy method to return null, indicating no user found
  //     jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

  //     // Call the removeUser method and expect it to throw NotFoundException
  //     await expect(service.removeUser(TaskId)).rejects.toThrow(NotFoundException);
  //   });
  // });



  // describe('createUser', () => {
  //   it('should create a user when valid data is provided', async () => {
  //     const createUserDto = {
  //       TaskId: 1,
  //       TaskName: 'testUser',
  //     };

  //     // Mocking the findOneBy method to return null, indicating user does not exist
  //     jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

  //     // Mocking the insert method of the repository to return a dummy value
  //     const mockInsertResult = {
  //       identifiers: [{ id: 1 }], // Assuming the inserted user ID is 1
  //     };
  //     jest.spyOn(userRepository, 'insert').mockResolvedValue(mockInsertResult);

  //     // Call the createUser method
  //     const result = await service.createUser(createUserDto);

  //     // Assert that the insert method of the repository was called with the correct user object
  //     expect(userRepository.insert).toHaveBeenCalledWith({
  //       TaskId: 1,
  //       TaskName: 'testUser',
  //     });

  //     // Assert that the result matches the expected value
  //     expect(result).toEqual({ id: 1 }); // Assuming the returned result contains the inserted user's ID
  //   });

  //   it('should throw BadRequestException if user with the provided TaskId already exists', async () => {
  //     const createUserDto = {
  //       TaskId: 1,
  //       TaskName: 'testUser',
  //     };

  //     // Mocking the findOneBy method to return a user, indicating user already exists
  //     jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ TaskId: 1 });

  //     // Call the createUser method and expect it to throw BadRequestException
  //     await expect(service.createUser(createUserDto)).rejects.toThrowError(BadRequestException);
  //   });
  // });



  // describe('update', () => {
  //   it('should update a user when valid data is provided', async () => {
  //     const userData = {
  //       TaskId: 1,
  //       TaskName: 'updatedName',
  //     };
  //     const mockUser: User = { TaskId: 1 }; // Assuming TaskId is needed for update
      
  //     userRepository.save.mockResolvedValue(mockUser);

  //     const result = await service.updateUser(1, userData);

  //     expect(result).toEqual(mockUser);
  //   });
  // });

  // describe('remove', () => {
  //   it('should delete a user when valid id is provided', async () => {
  //     const mockDeletedUser = {
  //       affected: 1,
  //     };

  //     userRepository.delete.mockResolvedValue(mockDeletedUser);

  //     const result = await service.removeUser(1);

  //     expect(result).toEqual(mockDeletedUser);
  //   });
  // });
