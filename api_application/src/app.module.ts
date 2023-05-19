import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NQueenModule } from './modules/n-queen/n-queen.module';
import { SudokuModule } from './modules/sudoku/sudoku.module';
import { MazeResolverModule } from './modules/maze-resolver/maze-resolver.module';
import configuration from './shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('postgres.host'),
        port: +configService.get<string>('postgres.port'),
        username: configService.get<string>('postgres.user'),
        password: configService.get<string>('postgres.password'),
        database: configService.get<string>('postgres.db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    NQueenModule,
    SudokuModule,
    MazeResolverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
