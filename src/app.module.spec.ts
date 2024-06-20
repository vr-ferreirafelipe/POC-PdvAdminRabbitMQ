import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './app.module';

describe('App Module', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should bootstrap the application', async () => {
    const appInstance = await app.init();
    expect(appInstance).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
