# PostgreSQL Connection Cheat Sheet (Mac / Homebrew)

| Step | Purpose | Command / Details |
|-----|--------|-------------------|
| 1 | Start PostgreSQL service | `brew services start postgresql@16` |
|  | Check service status | `brew services list \| grep postgres` |
| 2 | Connect to PostgreSQL server (recommended) | `psql -h localhost -p 5432 -U anup -d postgres` |
|  | Why specify `-d` | Default DB = username if `-d` is omitted |
| 3 | List all databases | `\l` |
| 4 | Connect to application DB (inside psql) | `\c ecommerce_db` |
|  | Connect directly from terminal | `psql -h localhost -U anup -d ecommerce_db` |
| 5 | List tables in current DB | `\dt` |
| 6 | Create database (if not exists) | `createdb -h localhost -U anup ecommerce_db` |
| 7 | Exit PostgreSQL | `\q` |

---

## Common Errors & Fixes

| Error Message | Root Cause | Fix |
|--------------|-----------|-----|
| `database "anup" does not exist` | Default DB = username | Use `-d postgres` |
| `database "ecommerce_db." does not exist` | Trailing dot in DB name | Remove `.` |
| `database "l" does not exist` | Typo in `-d` argument | Use correct DB name |
| `connection refused` | PostgreSQL not running | Start PostgreSQL service |

---

## 🔑 Golden Rule

| Concept | Order |
|-------|-------|
| PostgreSQL Flow | Server → Database → Tables |
