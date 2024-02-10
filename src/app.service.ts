import { PrismaService } from './prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService){}

  async getHello(): Promise<string> {
    return JSON.stringify(await this.prisma.user.findMany());
  }
}
