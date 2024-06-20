import { Body, Controller, Post } from '@nestjs/common';

import { RegisterSupermercadoUseCase } from './post-loja.use-case';

@Controller('supermercados')
export class SupermercadoController {
  constructor(private readonly registerSupermercadoUseCase: RegisterSupermercadoUseCase) {}

  @Post('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async register(@Body() body: any) {
    console.log('REGISTER');

    this.registerSupermercadoUseCase.execute(body);
  }
}
