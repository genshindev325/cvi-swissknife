import { ValidationPipe } from '@nestjs/common'

export const queryValidationPipe = () => {
  return new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidNonWhitelisted: true,
  })
}
