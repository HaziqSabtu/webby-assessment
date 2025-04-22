import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export class SignInDto extends createZodDto(signInSchema) {}
