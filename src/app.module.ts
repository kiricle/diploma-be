import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot(), ProjectModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
