import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule], // Prisma for DB, Auth for Guard

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // <-- export so other modules can use it
})
export class UserModule {}
