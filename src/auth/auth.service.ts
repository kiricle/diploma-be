import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 30;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const { hash, ...user } = await this.validateUser(dto);
    const tokens = await this.createTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const userExists = await this.userService.getByEmail(dto.email);

    if (userExists) throw new BadRequestException('User already exists');

    const { hash, ...user } = await this.userService.create(dto);

    const tokens = await this.createTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  private async createTokens(userId: number) {
    const data = { id: userId };

    const accessTokenPromise = this.jwt.signAsync(data, {
      expiresIn: '2h',
    });

    const refreshTokenPromise = this.jwt.signAsync(data, {
      expiresIn: '30d',
    });

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await verify(user.hash, dto.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Password is invalid');

    return user;
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const { hash, ...user } = await this.userService.getById(result.id);

    const tokens = await this.createTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
