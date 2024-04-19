import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('api/v2');  // ** esto permite que en el buscardor este prefijo ya de por ejemplo api/v2/nombredelporyecto asi aparece en el buscador

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  )

  await app.listen(process.env.PORT); // * esto llama al puerto que se declaro en .env

  console.log(`APP CORRIENDO EN EL PUERTO ${process.env.PORT}`);

}
bootstrap();
