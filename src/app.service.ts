import {Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

 
  // constructor(private http: HttpService) {}
  // async getStudent(firstName: string, lastName: string): Promise<Student> {
  //   const url = `../get-student?firstName=${firstName}&lastName=${lastName}`;
  //   const response = await this.http.get(url).toPromise();
  //   return response.data;
  // }

  getHello(): string {
    return 'Hello World!';
  }
}
