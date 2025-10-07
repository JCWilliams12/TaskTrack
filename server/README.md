TaskTrack Server
================

Scripts
-------
- dev: `npm run dev` - start development server with hot reload
- build: `npm run build` - compile TypeScript
- start: `npm start` - run compiled server from `dist`
- test: `npm test` - run unit tests

Environment
-----------
Copy `env.example` to `.env` and set:
- MONGO_URI
- JWT_SECRET

Run
---
1. `npm install`
2. `npm run dev`

Tests
-----
Tests use an in-memory MongoDB. Run `npm test`.

API
---
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Tasks: `GET /api/tasks`, `GET /api/tasks/:id`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`, `GET /api/tasks/stats/summary`


