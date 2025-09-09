import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { CustomValidationPipe } from './utils/validation-error';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { GlobalExceptionFilter } from './utils/global-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error']
  });
  app.enableCors({
    origin: '*'
  })
  // app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new CustomValidationPipe())
  app.use(graphqlUploadExpress({
    maxFileSize: 1 * 1000 * 1000 * 50,
    maxFiles: 10,
    // If you are using framework around express like [ NestJS or Apollo Serve ]
    // use this options overrideSendResponse to allow nestjs to handle response errors like throwing exceptions
    overrideSendResponse: false
  }));
  await app.listen(3000);
}
bootstrap();
