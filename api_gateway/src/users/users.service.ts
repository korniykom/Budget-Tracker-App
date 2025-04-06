import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  private readonly userServiceBaseUrl = 'http://localhost:3001/users';

  async register(createUserDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.userServiceBaseUrl}/register`,
        createUserDto,
      ),
    );
    return data;
  }

  async login(loginUserDto: any) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.userServiceBaseUrl}/login`, loginUserDto),
    );
    return data;
  }

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get(this.userServiceBaseUrl),
    );
    return data;
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.userServiceBaseUrl}/${id}`),
    );
    return data;
  }
}
