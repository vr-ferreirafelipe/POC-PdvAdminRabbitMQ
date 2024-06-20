import * as fs from 'fs';

import { Logger } from '@nestjs/common';

// Função assíncrona para obter a versão do package.json
export const getVersion = async (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile('package.json', 'utf8', (err, data) => {
      if (err) {
        Logger.error('Erro ao ler o arquivo package.json:', err);
        reject(err);
        return;
      }

      try {
        const packageJson = JSON.parse(data);
        resolve(packageJson.version);
      } catch (jsonError) {
        Logger.error('Erro ao analisar o JSON do package.json:', jsonError);
        reject(jsonError);
      }
    });
  });
};
