import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'transaction_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();

  await app.listen(3002);
  console.log(`Transaction service is running on: ${await app.getUrl()}`);
}
bootstrap();
