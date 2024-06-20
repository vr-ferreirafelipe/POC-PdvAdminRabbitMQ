import * as fs from 'fs';

import { getVersion } from './get-version-from-package';

jest.mock('fs');

describe('getVersion', () => {
  it('deve retornar a versão do package.json corretamente', async () => {
    const packageJson = {
      version: '1.0.0',
    };

    const readFileMock = jest.spyOn(fs, 'readFile');
    readFileMock.mockImplementationOnce(
      // @ts-ignore
      (
        path: fs.PathOrFileDescriptor,
        encoding: string,
        callback: (err: NodeJS.ErrnoException | null, data: string) => void
      ) => {
        callback(null, JSON.stringify(packageJson));
      }
    );

    const version = await getVersion();

    expect(version).toBe(packageJson.version);
    expect(readFileMock).toHaveBeenCalledWith('package.json', 'utf8', expect.any(Function));
  });

  it('deve lidar com erro na leitura do arquivo package.json', async () => {
    const invalidJson = '{invalid_json}';
    const expectedError = new Error('Erro simulado na leitura do arquivo');
    const readFileMock = jest.spyOn(fs, 'readFile');
    readFileMock.mockImplementationOnce(
      // @ts-ignore
      (
        path: fs.PathOrFileDescriptor,
        encoding: string,
        callback: (err: NodeJS.ErrnoException | null, data: string) => void
      ) => {
        callback(expectedError, invalidJson);
      }
    );

    await expect(getVersion()).rejects.toThrow(expectedError);
  });

  it('deve lidar com erro na análise do JSON do package.json', async () => {
    const invalidJson = '{invalid_json}';
    const readFileMock = jest.spyOn(fs, 'readFile');
    readFileMock.mockImplementationOnce(
      // @ts-ignore
      (
        path: fs.PathOrFileDescriptor,
        encoding: string,
        callback: (err: NodeJS.ErrnoException | null, data: string) => void
      ) => {
        callback(null, invalidJson);
      }
    );

    await expect(getVersion()).rejects.toThrow(SyntaxError);
  });
});
