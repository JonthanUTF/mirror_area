import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(email: string, password: string, username: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      username,
    });
    return this.login(user);
  }

  async oauthLogin(profile: any, provider: string) {
    let user = await this.usersService.findByEmail(profile.email);
    
    if (!user) {
      user = await this.usersService.create({
        email: profile.email,
        username: profile.displayName || profile.username,
        oauthProvider: provider,
        oauthId: profile.id,
      });
    }
    
    return this.login(user);
  }
}
