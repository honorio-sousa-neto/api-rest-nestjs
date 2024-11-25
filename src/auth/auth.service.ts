import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds); // Gerando o sal
    const hashedPassword = await bcrypt.hash(password, salt); // Criando o hash
    return hashedPassword;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword); // Comparando as senhas
  }

  async signIn(params: { email: string; password: string }) {
    console.log(this.jwtService);
    const { email, password } = params;
    const user = await this.usersService.findOne({ email });
    if (this.comparePasswords(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      const payload = { sub: user.id, username: user.email };
      return { access_token: await this.jwtService.signAsync(payload) };
    }
    throw new UnauthorizedException();
  }
}
