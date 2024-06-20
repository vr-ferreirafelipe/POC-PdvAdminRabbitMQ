import { Injectable } from '@nestjs/common';

@Injectable()
export class GetSupermercadosWithEcfsUseCase {
  execute() {
    return [
      {
        idLoja: 1,
        ecfs: [
          {
            ecf: 101,
          },
          {
            ecf: 102,
          },
        ],
      },
      {
        idLoja: 2,
        ecfs: [
          {
            ecf: 201,
          },
          {
            ecf: 202,
          },
        ],
      },
    ];
  }
}
