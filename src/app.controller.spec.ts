import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService} from './user/user.service';

describe('AppController', () => {
  let appController: AppController;
  let userService : UserService;

  // const requestMock ={
  //   query : {},
  // } as unknown as Request;

  // const statusResponseMock ={
  //   send: jest.fn((x) => x),
  // };

  // const responseMock = {
  //   status : jest.fn((x) => statusResponseMock),
  //   send: jest.fn((x) => x),
  // } as unknown as Response;

 


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // beforeEach(async () =>{
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [AppController],
  //     providers:[UserService],
  //   }).compile();

  //   appController = module.get<AppController>(AppController);
  //   userService = module.get<UserService>(UserService);
  // });


  // it('should be defined',() => {
  //   expect(appController).toBeDefined();
  // });

 

  // describe('getTask', () => {
  //   it('should return a status of 400', () => {
  //     appController.getTask(requestMock,responseMock);
  //     expect(responseMock.status).toHaveBeenCalledWith(400);
  //     expect(statusResponseMock.send).toHaveBeenCalledWith({
  //       msg: 'Misisng id or name query',
  //     });
  //   });

  //   it('should return a status of 200 when query params are present', () => {
  //     requestMock.query = {
  //       TaskId = '80',
  //       Taskname ='klub',
  //     };
  //     appController.getTask(requestMock,responseMock);
  //     expect(responseMock.send).toHaveBeenCalledWith(200);
  //   });
  // });



  
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
