# Employee Salary API

A backend API for managing companies, employees, compensation, and automated monthly payroll runs. Built with NestJS, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** NestJS (Express)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT (passport-jwt), bcrypt password hashing
- **Validation:** class-validator / class-transformer
- **Scheduling:** @nestjs/schedule (cron)
- **Testing:** Jest (unit), Supertest (e2e)

## Prerequisites

- Node.js 22
- PostgreSQL running locally (or a reachable connection string)
- npm

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

   If native install scripts are blocked (npm's `allow-scripts` security feature), approve the required packages:

   ```bash
   npm approve-scripts
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in real values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `DATABASE_URL` | PostgreSQL connection string |
   | `JWT_SECRET` | Secret used to sign JWTs — use a long, random value |
   | `JWT_EXPIRATION` | Token lifetime (e.g. `1d`) |
   | `PORT` | Port the server listens on (defaults to `3000`) |

3. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

   This creates the schema defined in `prisma/schema.prisma` and generates the Prisma Client.

4. **Start the server**

   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000` (or your configured `PORT`).

## Authentication

Most routes require a Bearer token. Obtain one via:

1. `POST /auth/register` — create an employer account
2. `POST /auth/login` — returns `{ "access_token": "..." }`

Include the token on subsequent requests:

```
Authorization: Bearer <access_token>
```

## API Overview

| Resource | Routes |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` |
| Companies | `POST /companies`, `GET /companies`, `GET /companies/:id`, `PATCH /companies/:id`, `DELETE /companies/:id` |
| Employees | `POST /companies/:companyId/employees`, `GET /companies/:companyId/employees`, `GET /companies/:companyId/employees/:id`, `PATCH .../:id`, `DELETE .../:id` |
| Compensation | `POST .../employees/:employeeId/compensation`, `GET .../compensation`, `PATCH .../compensation/:id`, `DELETE .../compensation/:id` |
| Payroll | `POST /companies/:companyId/payrolls/run`, `GET .../payrolls`, `GET .../payrolls/:id`, `GET .../payrolls/:id/payments` |

All company/employee/payroll routes are scoped to the authenticated employer — only companies (and their nested resources) owned by the logged-in employer are accessible.

List endpoints accept `?page=` and `?limit=` query params (both optional, default `1` and `20`).

## Payroll Behavior

- **Manual run:** `POST /companies/:companyId/payrolls/run` processes payroll for the current month for all `ACTIVE`/`ON_LEAVE` employees with an active compensation record as of that month.
- **Idempotency:** running payroll for a month that's already `COMPLETED` returns `409 Conflict`. Running it again after a `FAILED` attempt deletes the failed record and retries from scratch.
- **Failure handling:** if any employee lacks an active compensation record, the run creates a `FAILED` payroll record (zero totals, no payment records) and returns `400 Bad Request`.
- **Automated run:** a daily cron job (midnight) checks whether today is the last day of the month; if so, it runs payroll for every company in the system, logging (not throwing) per-company failures so one company's issue doesn't block the rest.

## Testing

**Unit tests** (mocked Prisma/services, no real database):

```bash
npm run test
```

**End-to-end tests** (real database required — exercises the full stack: auth, companies, employees, compensation, payroll, validation, and authorization):

```bash
npm run test:e2e
```

**Coverage report:**

```bash
npm run test:cov
```

## Project Structure

```
src/
  auth/          # registration, login, JWT guard
  companies/     # company CRUD
  employees/     # employee CRUD
  compensation/  # compensation CRUD, active-compensation lookup
  payroll/       # payroll run logic, cron job, payroll history
  common/
    guards/      # ownership guards (company/employee/compensation/payroll)
    dto/         # shared DTOs (pagination)
  prisma/        # PrismaService wrapper
prisma/
  schema.prisma  # database schema
test/
  app.e2e-spec.ts
```