import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );
    createUserDto.password = hashedPassword;
    return this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('per-page') perPage: string,
    @Query('search') search?: string,
  ) {
    return this.userService.findAll({
      skip: parseInt(perPage) ? parseInt(page) - 1 : undefined,
      take: parseInt(perPage) || undefined,
      where: {
        name: search ? { contains: search, mode: 'insensitive' } : {},
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update({ id }, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove({ id });
  }
}
