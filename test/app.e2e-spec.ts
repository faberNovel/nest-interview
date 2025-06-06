import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

const secretPassword = 'password123+';

describe('NestJS app (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/hello (GET)', async () => {
    // When
    const response = request(app.getHttpServer()).get('/hello');

    // Then
    return await response.expect(200).expect('Hello World!');
  });

  it('/pokemon (GET) - valid pokemon name', async () => {
    // Given
    const validName = 'bulbasaur';

    // When
    const response = request(app.getHttpServer())
      .get(`/pokemon/pokemon?name=${validName}`)
      .set('authorization', secretPassword);

    // Then
    return response.expect(200).expect({
      name: 'bulbasaur',
      id: 1,
      height: 7,
      weight: 69,
      types: ['grass', 'poison'],
      species: {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
      },
    });
  });

  it('/pokemon (GET) - invalid pokemon name', async () => {
    // Given
    const invalidName = 'abc';

    // When
    const response = request(app.getHttpServer())
      .get(`/pokemon/pokemon?name=${invalidName}`)
      .set('authorization', secretPassword);

    // Then
    return response.expect(404);
  });

  it('/pokemon (GET) - second generation pokemon name', async () => {
    // Given
    const invalidName = 'togepi';

    // When
    const response = request(app.getHttpServer())
      .get(`/pokemon/pokemon?name=${invalidName}`)
      .set('authorization', secretPassword);

    // Then
    return await response.expect(404);
  });

  it('/pokemon (GET) - missing name', async () => {
    // When
    const response = request(app.getHttpServer())
      .get(`/pokemon/pokemon`)
      .set('authorization', secretPassword);

    // Then
    return await response.expect(400);
  });

  it('/pokemon (GET) - empty name', async () => {
    // When
    const response = request(app.getHttpServer())
      .get(`/pokemon/pokemon?name=`)
      .set('authorization', secretPassword);

    // Then
    return await response.expect(400);
  });

  // Look at this test only if asked by the interviewer
  it.skip('/pokemon (GET) - unauthenticated call', async () => {
    // Given
    const validName = 'bulbasaur';

    // When
    const response = request(app.getHttpServer())
      .get(`/pokemon/pokemon?name=${validName}`)
      .set('authorization', 'XXX');

    // Then
    return await response.expect(401).expect(undefined);
  });
});
