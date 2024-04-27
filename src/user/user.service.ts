import { Injectable } from '@nestjs/common';
import { AuthDto } from './../auth/dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ email, password }: AuthDto) {
    const user = {
      email,
      name: '',
      hash: await hash(password),
    };

    const createdUser = this.prisma.user.create({
      data: user,
    });

    return createdUser;
  }

  getByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  getById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
