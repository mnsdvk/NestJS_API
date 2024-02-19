import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';






/**
 * whatever the string pass in controller decorator it will be appended to
 * API URL. to call any API from this controller you need to add prefix which is
 * passed in controller decorator.
 * in our case our base URL is http://localhost:3000/user
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Post decorator represents method of request as we have used post decorator the method
   * of this API will be post.
   * so the API URL to create User will be
   * POST http://localhost:3000/user/
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
  
    return this.userService.createUser(createUserDto);
  }

  /**
   * we have used get decorator to get all the user's list
   * so the API URL will be
   * GET http://localhost:3000/user
   */
  @Get()
  getUser(@Query('TaskId') TaskId: string) {
    if(TaskId)
    {
      return this.userService.viewUser(+TaskId);
    }
    else  
    return this.userService.findAllUser();
    
  }

  // @Get()
  
  // getUser() {
  // return this.userService.findAllUser();
  // }

  
  
    // getTask(@Req() request:Request, @Res() response: Response){
    // const{TaskId,TaskName} = request.query;
    // if(!TaskId || !TaskName){
    //   response
    //   .status(400)
    //   .send({msg:'Missing id or name query parameter'});

    // }
  //   else{
  //     response.send(200);
  //   }
  // }




  @Get(':TaskId')
  findOne(@Param('TaskId') TaskId: string) {
    return this.userService.viewUser(+TaskId);
  }

  

  
  // @Get()
  // //@Query
  // findAll() {
  //   return this.userService.findAllUser();
  // }

  // /**
  //  * we have used get decorator with id param to get id from request
  //  * so the API URL will be
  //  * GET http://localhost:3000/user/:id
  //  */
  

 
  


  
  // @Get(':TaskId')
  // findOne( @Query('TaskId') TaskId: number) {
  //   if (TaskId) {
  //     return `Filtered user by  TaskId=${TaskId}`;
  //   } 
  // }



 



  /**
   * we have used patch decorator with id param to get id from request
   * so the API URL will be
   * PATCH http://localhost:3000/user/:id
   */
  @Patch(':TaskId')
  update(@Param('TaskId') TaskId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+TaskId, updateUserDto);
  }

  /**
   * we have used Delete decorator with id param to get id from request
   * so the API URL will be
   * DELETE http://localhost:3000/user/:id
   */


  // users.controller.ts




//   @Delete(':TaskId/:TaskName')
//   async deleteUserByIdAndName(@Param('TaskId') TaskId: string, @Param('TaskName') TaskName: string): Promise<string> {
//     try {
//       await this.userService.removeUser(+TaskId);
//       return 'User deleted successfully';
//     } catch (error) {
//       throw new Error('User not found');
//     }
//   }
// }



  // @Delete(':TaskId')
  // async remove(@Param('TaskId') TaskId: number): Promise<{affected? : number}> {

  //   //throw new BadRequestException('')
    
  //   return await this.userService.removeUser(+TaskId);


   
  // }


  
  @Delete(':TaskId')
  async remove(@Param('TaskId') TaskId: number): Promise<void> {

    //throw new BadRequestException('')
    
    
    await this.userService.removeUser(+TaskId);


   
  }
}
