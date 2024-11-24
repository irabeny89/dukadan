# GasRefill

GasRefill Oil and Gas Nig Ltd online service.

Table Of Content
- [GasRefill](#gasrefill)
  - [Getting Started](#getting-started)
  - [Development](#development)
  - [Database](#database)
  - [Authentication Routes](#authentication-routes)

## Getting Started

Clone the repo and install dependencies.

## Development

To start the development server run:

```bash
bun run dev
```

Open <http://localhost:3000/> with your browser to see the result.

## Database

Using [Bunjs Sqlite](https://bun.sh/docs/api/sqlite) for database.

Using [Migralite](https://github.com/i9or/migralite?tab=readme-ov-file#migration-file-generation) for migrations.

```bash
# example:
bun run migration:gen "Create users table"
```

The command above will create a migration file in ./migrations folder called ./migrations/20240815123456__create-users-table.sql.

## Authentication Routes

Authenticaation is based on routes for different user roles.

Use the below routes for authentication:

1. Customer: `/auth?role=customer`
2. Owner: `/auth?role=owner`
3. Admin: `/auth?role=admin`
4. Driver: `/auth?role=driver`
