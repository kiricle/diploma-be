import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: AuthDto) {
    const response = await this.authService.login(dto);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('/register')
  async register(@Body() dto: AuthDto) {
    const response = await this.authService.register(dto);

    return response;
  }

  // @HttpCode(200)
  // @Post('login/access-token')
  // async getNewTokens(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const refreshTokenFromCookies =
  //     req.cookies[this.authService.REFRESH_TOKEN_NAME];

  //   if (!refreshTokenFromCookies) {
  //     this.authService.removeRefreshTokenFromResponse(res);
  //     throw new UnauthorizedException('Refresh token has not passed');
  //   }

  //   const { refreshToken, ...response } = await this.authService.getNewTokens(
  //     refreshTokenFromCookies,
  //   );

  //   this.authService.addRefreshTokenToResponse(res, refreshToken);

  //   return response;
  // }

  @HttpCode(200)
  @Post('logout')
  async logout() {
    return true;
  }
}
