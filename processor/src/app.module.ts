import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './shared/config/configuration';
import { MazeResolverModule } from './modules/maze-resolver/maze-resolver.module';
import { NQueenModule } from './modules/n-queen/n-queen.module';
import { SudokuModule } from './modules/sudoku/sudoku.module';
import { RabbitMQServerModule } from './shared/infra/rabbitmq-server.module';

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
    RabbitMQServerModule,
    MazeResolverModule,
    NQueenModule,
    SudokuModule,
  ],
})
export class AppModule {}
