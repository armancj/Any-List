import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../auth.constant';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(jwtConstants.JWT_SECRET),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayloadInterface) {
    const { password, ...user } = await this.authService.validate(payload.sub);
    if (!user.isActive)
      throw new UnauthorizedException(
        'User is Inactive, talk with administrator',
      );
    return user;
  }
}
