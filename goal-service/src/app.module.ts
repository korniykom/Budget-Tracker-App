import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'goals_service',
      autoLoadEntities: true,
      synchronize: true,
    }),

    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'transaction_queue',
          queueOptions: { durable: false },
        },
      },
    ]),

    GoalsModule,
  ],
})
export class AppModule {}
