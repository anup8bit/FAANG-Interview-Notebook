PostgreSQL setup & basic configuration on Mac (end-to-end):
1. Install: brew update && brew install postgresql@16.
2. Start service: sho (or manual: pg_ctl -D /opt/homebrew/var/postgresql@16 start).
3. PATH fix (Apple Silicon): echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc (Intel: /usr/local/opt/...).
4. Verify: psql --version and psql postgres.
5. Create role & DB: createuser -s anup → createdb app_db -O anup.
6. Set password: psql postgres -c "ALTER USER anup WITH PASSWORD 'StrongPwd';".
7. Config files: open postgresql.conf (port, listen): /opt/homebrew/var/postgresql@16/postgresql.conf; open pg_hba.conf (auth): set host all all 127.0.0.1/32 md5.
8. Restart: brew services restart postgresql@16.
9. Connect: psql -h localhost -U anup -d ecommerce_db.
10. Spring Boot hint: spring.datasource.url=jdbc:postgresql://localhost:5432/app_db, username=anup, password=StrongPwd.

### psql postgres -c "ALTER USER anup WITH PASSWORD 'anup027gupta';"

Step 1: You are already logged in (good)
psql postgres
Step 2: Create the user FIRST
CREATE ROLE anup WITH LOGIN PASSWORD 'StrongPwd';
Step 3: Verify user exists
\du
You must see anup in the list.
Step 4: Now create the database
CREATE DATABASE app_db OWNER anup;
Step 5: Exit
\q
Step 6: Login using the new user
psql -h localhost -U anup -d app_db
Why your command keeps failing
You keep running:
CREATE DATABASE app_db OWNER anup;
before creating anup, so Postgres rejects it every time.
👉 Run Step 2 now and paste the output of \du if it still fails.







PostgreSQL setup on MacBook Pro (Apple Silicon or Intel): Install via Homebrew: brew update && brew install postgresql@16, then start it with brew services start postgresql@16 (or pg_ctl -D /opt/homebrew/var/postgresql@16 start on Apple Silicon, /usr/local/var/... on Intel); verify using psql postgres. Create a user and DB: createuser -s anup and createdb mydb. To connect: psql -d mydb. Config files live under /opt/homebrew/var/postgresql@16/ (Apple Silicon). To stop: brew services stop postgresql@16. Alternative (GUI): install Postgres.app, open → initialize → use psql from terminal.



psql: command not found means PostgreSQL binaries are not in your PATH. Fix (most common on Mac): if you installed via Homebrew on Apple Silicon (M-series), run echo 'export PATH="/opt/homebrew/bin:/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc; on Intel Mac use /usr/local/bin and /usr/local/opt/postgresql@16/bin instead. Verify with which psql and psql --version. If still missing, ensure Postgres is installed: brew list | grep postgresql or install it: brew install postgresql@16. If using Postgres.app, add it via export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH".