import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../users/schemas/user.schema';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { refreshTokenHash: hash } },
    );
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(
    email: string,
    nickname: string,
    password: string,
    res: Response,
  ) {
    const exists = await this.userModel.findOne({
      $or: [{ email }, { nickname }],
    });

    if (exists) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      nickname,
      passwordHash,
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
      user.email,
    );

    await this.saveRefreshToken(user._id.toString(), refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user._id.toString(),
      user.email,
    );

    await this.saveRefreshToken(user._id.toString(), refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async refresh(req: any, res: Response) {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      if (!payload?.sub) {
        throw new UnauthorizedException();
      }

      const user = await this.userModel.findById(payload.sub);

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException();
      }

      const isValid = await bcrypt.compare(token, user.refreshTokenHash);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      const tokens = await this.generateTokens(user._id.toString(), user.email);

      await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { accessToken: tokens.accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user._id,
      email: user.email,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isPrivate: user.isPrivate,
    };
  }

  async logout(req: any, res: Response) {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        if (payload?.sub) {
          await this.userModel.updateOne(
            { _id: payload.sub },
            { $set: { refreshTokenHash: null } },
          );
        }
      } catch {}
    }

    res.clearCookie('refreshToken');
    return { success: true };
  }
}
