# Task 3: Observability & Modular Express API

A small REST API built with **Express.js** and **TypeScript**, structured with a clean separation of concerns (Routes, Controllers, Services), a custom global observability middleware that logs every request, and API key protection on the write endpoints.

The API manages a mock `users` resource stored in memory.

## Features

- Modular architecture: **Routes → Controllers → Services**
- Custom global **observability middleware**: logs the ISO timestamp, HTTP method, URL, and processing time in milliseconds for every request
- Custom **security middleware** (`requireAPIKey`): protects the create, update, and delete endpoints with an `x-api-key` header
- Full **CRUD** on `/api/users` using `express.json()` payload parsing
- Secret kept out of the code and out of git, loaded from a `.env` file
- Strict TypeScript configuration (`strict`, `noImplicitAny`, `strictNullChecks`)
- Input validation with proper status codes (`200`, `201`, `204`, `400`, `401`, `404`)

## Tech Stack

- Node.js
- Express 5
- TypeScript
- tsx (development runner)

## Project Structure

```
src/
├── controllers/
│   └── usercontrollers.ts   # handles req/res, validation, status codes
├── middleware/
│   ├── requestLogger.ts     # global observability middleware
│   └── requireAPIKey.ts     # API key protection middleware
├── routes/
│   └── userRoutes.ts        # maps endpoints to controllers
├── services/
│   └── userServices.ts      # data logic (in-memory mock database)
└── index.ts                 # app setup, middleware, route mounting
.env.example                 # template for the required environment variables
```

**How a request flows:**

```
Client → requestLogger → router → [requireAPIKey] → controller → service → controller → Client
```

`requireAPIKey` only sits in front of the POST, PUT, and DELETE routes.

- **Routes** only decide which controller handles which endpoint, and which middleware protects it.
- **Controllers** read the request (`req`), validate input, call the service, and send the response (`res`).
- **Services** contain the data logic and know nothing about HTTP.

## Getting Started

### Prerequisites

- Node.js 20.6 or later (required for the `--env-file` flag)
- npm

### Install and run

```bash
npm install
```

Create a `.env` file from the template and set your own secret:

```bash
cp .env.example .env
```

```
API_KEY=your-secret-key
```

Then start the server:

```bash
npm run dev
```

The server starts on `http://localhost:3000`.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run the server in watch mode with `tsx`, loading `.env` |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled build from `dist/` (the `API_KEY` environment variable must be set) |

## API Endpoints

Base path: `/api/users`

| Method | Endpoint | Description | API key | Success | Errors |
|---|---|---|---|---|---|
| GET | `/api/users` | Get all users | No | `200` | |
| GET | `/api/users/:id` | Get one user by id | No | `200` | `404` if not found |
| POST | `/api/users` | Create a user | **Required** | `201` | `400` if `name` is missing or not a string, `401` |
| PUT | `/api/users/:id` | Update a user's name | **Required** | `200` | `400` invalid name, `401`, `404` if not found |
| DELETE | `/api/users/:id` | Delete a user | **Required** | `204` | `401`, `404` if not found |

### Examples

Get all users (no key needed):

```bash
curl http://localhost:3000/api/users
```

Create a user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{"name": "omar"}'
```

Update a user:

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{"name": "ahmed"}'
```

Delete a user:

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "x-api-key: your-secret-key"
```

### Error response format

```json
{ "message": "User not found" }
```

## Observability Middleware

`src/middleware/requestLogger.ts` is mounted globally before the routes. For every request it records the start time, waits for the response to finish (`res.on("finish")`), and then logs the ISO timestamp, HTTP method, URL, and the total processing time in milliseconds.

## API Key Protection (Bonus)

`src/middleware/requireAPIKey.ts` protects the endpoints that modify data. It reads the `x-api-key` header and compares it with the secret stored in the `API_KEY` environment variable.

| Situation | Response |
|---|---|
| Header missing | `401 Unauthorized` |
| Header present but wrong | `401 Unauthorized` |
| Header matches the secret | The request continues to the controller |
| `API_KEY` is not configured on the server | `500`, so the endpoints never fall open by accident |

Example rejected response:

```json
{ "message": "Unauthorized: invalid or missing API key" }
```

The secret is never written in the source code. It lives in `.env`, which is listed in `.gitignore`, and `.env.example` documents the variable without exposing a real value.

## Notes

- Data is stored in memory, so it resets every time the server restarts. A real database is introduced in a later task.
