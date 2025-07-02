import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Document Management API')
    .setDescription('API for managing documents and users')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Database connection check
  try {
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      const opts = dataSource.options as any;
      const dbInfo = opts.host && opts.port && opts.database
        ? `${opts.type}://${opts.host}:${opts.port}/${opts.database}`
        : `${opts.type}`;
      console.log(`✅ Database connected: ${dbInfo}`);
    } else {
      console.log('❌ Database not connected');
    }
  } catch (e: any) {
    console.log('❌ Database connection status unknown:', e);
  }

  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api`);
}
bootstrap();
