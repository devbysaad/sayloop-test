# Sayloop Backend

Language learning + debate platform API.
Stack: Node.js + Express + Prisma + PostgreSQL (Neon) + Clerk Auth

## Setup

```bash
npm install
cp .env.example .env        # fill in your values
npm run generate            # generate Prisma client
npm run migrate             # run DB migrations
npm run seed                # seed initial data
npm run dev                 # start dev server
```

## Scripts

| Script              | Description                        |
|---------------------|------------------------------------|
| `npm run dev`       | Start with nodemon (hot reload)    |
| `npm run start`     | Production start                   |
| `npm run migrate`   | Run Prisma migrations (dev)        |
| `npm run migrate:prod` | Deploy migrations to production |
| `npm run seed`      | Seed database with initial data    |
| `npm run studio`    | Open Prisma Studio                 |
| `npm run generate`  | Regenerate Prisma client           |

## Auth

Authentication is handled by **Clerk** on the frontend.
The backend verifies Clerk JWT tokens via middleware.
On first login, call `POST /api/users/sync` to create the user in your DB.
