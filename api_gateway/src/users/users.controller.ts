import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.register(createUserDto);
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to register user',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      return await this.usersService.login(loginUserDto);
    } catch (error) {
      this.logger.error(`Failed to login user: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to login user',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      this.logger.error(`Failed to get users: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to get users',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to get user: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Failed to get user',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
