import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  controllers: [UserController, AuthController],
  providers: [UserService, PrismaService, AuthService],
  exports: [UserService],
})
export class UserModule {}
