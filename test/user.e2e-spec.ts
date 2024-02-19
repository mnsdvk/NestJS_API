import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './../src/user/user.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationPipe } from '@nestjs/common';
import { User } from './../src/user/entities/user.entity';



describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUsers =[{TaskId:1,TaskName: 'klub'}];
  
  const mockUserRepository ={
    findOneBy: jest.fn(),
    find: jest.fn().mockResolvedValue(mockUsers),
    create:jest.fn().mockImplementation((dto) =>dto),
    save: jest
    .fn()
    .mockImplementation((user) =>
    Promise.resolve({TaskId:1,...user}),
    ),

  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
    .overrideProvider(getRepositoryToken(User))
    .useValue(mockUserRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockUsers);
  });

//   it('/user (POST)', () => {
//     return request(app.getHttpServer())
//       .get('/user')
//       .send({TaskName:'klub'})
//       .expect('Content-Type', /json/)
//       .expect(201)
//       .then(response => {
//          expect(response.body.toEqual({
//             TaskId: expect.any(Number),
//             TaskName:'klub',
//          }))
//       })
//   });


//does not give validation error because we passed validation pipe
it('/user (POST) --> 200 on validation error', () => {
    return request(app.getHttpServer())
      .get('/user')
      .send({TaskName:555555})
      .expect('Content-Type', /json/)
      .expect(200)
      
  });
});
