import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let companyId: string;
  let employeeId: string;
  let secondAccessToken: string;

  const uniqueSuffix = Date.now();
  const testEmail = `e2e-test-${uniqueSuffix}@example.com`;
  const testPassword = 'SecurePass123!';
  const secondEmail = `e2e-test-second-${uniqueSuffix}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) creates a new employer', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      firstName: 'E2E',
      lastName: 'Tester',
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(testEmail);
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('/auth/login (POST) returns an access_token', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    accessToken = res.body.access_token;
  });

  it('/companies (POST) creates a company', async () => {
    const res = await request(app.getHttpServer())
      .post('/companies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `E2E Test Co ${uniqueSuffix}` });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    companyId = res.body.id;
  });

  it('/companies/:companyId/employees (POST) creates an employee', async () => {
    const res = await request(app.getHttpServer())
      .post(`/companies/${companyId}/employees`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: `jane-${uniqueSuffix}@example.com`,
        employeeNumber: `EMP-${uniqueSuffix}`,
        jobTitle: 'Engineer',
      });

    expect(res.status).toBe(201);
    employeeId = res.body.id;
  });

  it('/companies/:companyId/employees/:employeeId/compensation (POST) adds compensation', async () => {
    const res = await request(app.getHttpServer())
      .post(`/companies/${companyId}/employees/${employeeId}/compensation`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        salary: 500000,
        salaryFrequency: 'MONTHLY',
        effectiveFrom: '2026-01-01T00:00:00.000Z',
      });

    expect(res.status).toBe(201);
  });

  it('/companies/:companyId/payrolls/run (POST) completes payroll', async () => {
    const res = await request(app.getHttpServer())
      .post(`/companies/${companyId}/payrolls/run`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('COMPLETED');
    expect(res.body.totalEmployees).toBe(1);
  });

  it('/companies/:companyId/payrolls/run (POST) rejects duplicate run with 409', async () => {
    const res = await request(app.getHttpServer())
      .post(`/companies/${companyId}/payrolls/run`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Payroll for this month has already been run.');
  });

  it('rejects unauthenticated requests with 401', async () => {
    const res = await request(app.getHttpServer()).get(`/companies/${companyId}/payrolls`);

    expect(res.status).toBe(401);
  });

  it('rejects negative pagination with 400', async () => {
    const res = await request(app.getHttpServer())
      .get(`/companies/${companyId}/payrolls?page=-1`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(400);
  });

  it('registers a second, unrelated employer', async () => {
  const res = await request(app.getHttpServer()).post('/auth/register').send({
    firstName: 'Second',
    lastName: 'Employer',
    email: secondEmail,
    password: testPassword,
  });

  expect(res.status).toBe(201);
});

it('logs in as the second employer', async () => {
  const res = await request(app.getHttpServer()).post('/auth/login').send({
    email: secondEmail,
    password: testPassword,
  });

  expect(res.status).toBe(201);
  secondAccessToken = res.body.access_token;
});

it('blocks the second employer from viewing the first employer\'s company', async () => {
  const res = await request(app.getHttpServer())
    .get(`/companies/${companyId}`)
    .set('Authorization', `Bearer ${secondAccessToken}`);

  expect(res.status).toBe(404);
});

it('blocks the second employer from listing the first employer\'s employees', async () => {
  const res = await request(app.getHttpServer())
    .get(`/companies/${companyId}/employees`)
    .set('Authorization', `Bearer ${secondAccessToken}`);

  expect(res.status).toBe(404);
});

it('blocks the second employer from running payroll on the first employer\'s company', async () => {
  const res = await request(app.getHttpServer())
    .post(`/companies/${companyId}/payrolls/run`)
    .set('Authorization', `Bearer ${secondAccessToken}`);

  expect(res.status).toBe(404);
});

it('blocks the second employer from viewing the first employer\'s payroll history', async () => {
  const res = await request(app.getHttpServer())
    .get(`/companies/${companyId}/payrolls`)
    .set('Authorization', `Bearer ${secondAccessToken}`);

  expect(res.status).toBe(404);
});
});