```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

```bash
brew install node
```

```bash
brew install postgresql@14
```

```bash
brew install --cask postgres-app
```

If installed via Homebrew:

```bash
brew services start postgresql@14
```

```bash
echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

```bash
# Connect to PostgreSQL with your macOS username
psql postgres

# Create the database
CREATE DATABASE solana_token_creator;
```

If you want to set up a password for your PostgreSQL user:

```bash
psql postgres
\password
```

```bash
echo 'export SOLANA_RPC_ENDPOINT="https://your-rpc-endpoint.com"' >> ~/.zshrc
source ~/.zshrc
```

```bash
brew install direnv
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
```

## Troubleshooting macOS Issues

### PostgreSQL Connection Issues

If you have trouble connecting to PostgreSQL:

1. Check if PostgreSQL is running:
   ```bash
   brew services list | grep postgresql
   ```

2. Ensure PostgreSQL is listening on the expected port:
   ```bash
   lsof -i:5432
   ```

3. Check PostgreSQL logs:
   ```bash
   less /usr/local/var/log/postgresql@14.log
   ```

### Node Permission Issues

If you encounter permission issues with npm:

```bash
# Fix ownership 
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### Port Already in Use

If port 3000 is already in use by another application:

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

Or change the port in your .env file.