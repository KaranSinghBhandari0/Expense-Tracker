# Expense Tracker API

A modular REST API built with Node.js, Express, and MongoDB/Mongoose.

## Requirements

- Node.js 18.18 or newer
- MongoDB local instance or a MongoDB Atlas connection string
- npm

## Run in VS Code

1. Extract the ZIP and open the `expense-tracker` folder in VS Code.
2. Open a terminal in that folder and run:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `MONGODB_URI` and a strong `ADMIN_TOKEN`.
4. Start MongoDB if using a local database.
5. Start the API:

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000/health`.

Do not commit `.env` or share your admin token.

## Authentication design

This starter follows the requested simple header-based protection:

- **Create user:** `Authorization: Bearer <ADMIN_TOKEN>` where the token must match `ADMIN_TOKEN` in `.env`.
- **Protected transaction list/create/update/delete/summary:** `x-user-id: <existing MongoDB user ID>`.
- User ID header authentication is suitable for a learning/demo project, but **it is not secure authentication for a public production API**: anyone who obtains or guesses an ID can impersonate that user. For production, replace it with real authentication (e.g. signed JWTs tied to a user) and authorization checks.

The transaction list is scoped to the user identified by `x-user-id`. Create/update/delete operations are also scoped to that user. `GET /api/transactions/:id` is intentionally public because the requested API list did not mark it protected; if transaction privacy matters, protect it and scope it to the authenticated user too.

## Routes

| Method | Path | Protection | Description |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/api/users` | Admin bearer token | Create a user |
| GET | `/api/users/:id` | Public | Get user details |
| GET | `/api/transactions?limit=10` | `x-user-id` | List the current user's transactions; no limit returns all |
| GET | `/api/transactions/summary` | `x-user-id` | Get total expenses, total income, and net savings |
| GET | `/api/transactions/:id` | Public | Get transaction by ID |
| POST | `/api/transactions` | `x-user-id` | Create a transaction for that user |
| PATCH | `/api/transactions/:id` | `x-user-id` | Partially update a transaction |
| PUT | `/api/transactions/:id` | `x-user-id` | Update supplied transaction fields |
| DELETE | `/api/transactions/:id` | `x-user-id` | Delete a transaction owned by that user |

`limit` must be an integer from 1 to 1000. Omitting it returns all matching transactions. Transaction `type` must be `income` or `expense`; `amount` must be greater than zero. `createdAt` and `modifiedAt` are generated automatically.

### Financial summary

The summary endpoint calculates totals across **all transactions belonging to the specified user**, regardless of any transaction list limit.

- `totalExpense`: Sum of all transactions with type `expense`.
- `totalIncome`: Sum of all transactions with type `income`.
- `totalSavings`: Total income minus total expenses.

If the user has no transactions, all three totals are zero. Net savings represent recorded income minus expenses, not a verified bank balance.

## Example requests

### 1. Create a user

```http
POST http://localhost:3000/api/users
Authorization: Bearer replace-with-a-long-random-secret
Content-Type: application/json

{
  "name": "Aarav"
}
```

Copy the returned `data.id` for the next calls.

### 2. Create a transaction

```http
POST http://localhost:3000/api/transactions
x-user-id: YOUR_USER_ID
Content-Type: application/json

{
  "title": "Groceries",
  "amount": 850.50,
  "category": "Food",
  "type": "expense"
}
```

### 3. List transactions

```http
GET http://localhost:3000/api/transactions?limit=20
x-user-id: YOUR_USER_ID
```

Omit `?limit=20` to retrieve all transactions belonging to that user.

### 4. Get financial summary

```http
GET http://localhost:3000/api/transactions/summary
x-user-id: YOUR_USER_ID
```

Example response:

```json
{
  "success": true,
  "message": "Transaction summary retrieved successfully.",
  "data": {
    "totalExpense": 4000,
    "totalIncome": 10000,
    "totalSavings": 6000
  }
}
```

### 5. Get a transaction by ID

```http
GET http://localhost:3000/api/transactions/YOUR_TRANSACTION_ID
```

### 6. Update a transaction

```http
PATCH http://localhost:3000/api/transactions/YOUR_TRANSACTION_ID
x-user-id: YOUR_USER_ID
Content-Type: application/json

{
  "amount": 900,
  "category": "Household"
}
```

### 7. Delete a transaction

```http
DELETE http://localhost:3000/api/transactions/YOUR_TRANSACTION_ID
x-user-id: YOUR_USER_ID
```

## Response format

Success responses contain `success`, `message`, and `data`. Errors use a consistent shape:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

## Environment variables

See `.env.example`. For production, use a managed secret store/environment variables, a strong random admin token, an Atlas/managed MongoDB URI with least-privilege credentials, a specific `CORS_ORIGINS` allowlist, HTTPS, and real user authentication. Do not use a wildcard CORS origin as an access-control mechanism.