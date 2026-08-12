# Employee Salary API

A simple payroll-flavoured REST API built with NestJS. Manages employee records in memory and calculates net pay after a flat tax deduction.

## Stack

- Node.js
- TypeScript
- NestJS

## Data Storage

In-memory (a plain array inside the service). No database — data resets whenever the server restarts.

## Endpoints

| Method | Route                  | Description                        |
|--------|-------------------------|-------------------------------------|
| POST   | `/employees`            | Add a new employee                  |
| GET    | `/employees`             | List all employees                  |
| GET    | `/employees/:id/pay`     | Get an employee's net pay after tax |
| DELETE | `/employees/:id`         | Remove an employee                  |

### POST /employees — request body

```json
{
  "name": "Adeniran Margaret",
  "role": "Backend Engineer",
  "baseSalary": 500000
}
```

## Business Rules

- Net pay is calculated as base salary minus a flat 10% tax deduction.
- Requesting or deleting an employee ID that doesn't exist returns a `404 Not Found`.

## Running the Project

```bash
npm install
npm run start
```

The server runs on `http://localhost:3000` by default.

## Testing the API

Use Postman (or any HTTP client) to send requests to the routes above. No authentication is required.
