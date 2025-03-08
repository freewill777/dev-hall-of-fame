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



# Windows-Specific Setup Instructions

This guide covers steps to set up the Solana token creator hall of fame project on Windows.

## Installing Prerequisites

### 1. Install Node.js and npm

1. Download the installer from the [official Node.js website](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Verify installation by opening Command Prompt and running:
   ```
   node -v
   npm -v
   ```

### 2. Install PostgreSQL

1. Download the installer from the [PostgreSQL website](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the postgres user
4. Add PostgreSQL bin directory to your PATH:
   - During installation, there's an option to add to PATH
   - Or manually add `C:\Program Files\PostgreSQL\14\bin` to your system PATH

### 3. Install Git

1. Download Git for Windows from the [Git website](https://git-scm.com/download/win)
2. Run the installer and follow the installation wizard
3. Verify installation by opening Command Prompt and running:
   ```
   git --version
   ```

## Setting Up the Project

### 1. Create Project Directory

Open Command Prompt as Administrator:

```cmd
mkdir solana-token-creator-hall-of-fame
cd solana-token-creator-hall-of-fame
```

### 2. Initialize the Project

```cmd
npm init -y
npm install --save-dev typescript ts-node nodemon @types/node @types/express @types/cors @types/helmet eslint
npx tsc --init
```

### 3. Install Dependencies

```cmd
npm install express cors helmet dotenv pg pg-promise cron winston @solana/web3.js @solana/spl-token bn.js bs58
```

### 4. Configure TypeScript

Edit `tsconfig.json` as specified in the main setup guide.

### 5. Setting Up PostgreSQL

1. Open Command Prompt as Administrator
2. Connect to PostgreSQL:
   ```cmd
   psql -U postgres
   ```
3. Enter the password you created during installation
4. Create the database:
   ```sql
   CREATE DATABASE solana_token_creator;
   ```
5. Connect to the new database:
   ```sql
   \c solana_token_creator
   ```

6. Import the schema (assuming you've created the init.sql file):
   ```cmd
   psql -U postgres -d solana_token_creator -f database/init.sql
   ```

### 6. Create .env File

Create a `.env` file in your project root with the following content:

```
# Application
PORT=3000
NODE_ENV=development

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=solana_token_creator
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here

# Solana
SOLANA_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
SOLANA_COMMITMENT=confirmed

# Scheduler
TOKEN_FETCH_CRON=*/10 * * * *
POOL_FETCH_CRON=*/30 * * * *
RANKING_UPDATE_CRON=0 * * * *
```

Make sure to replace `your_password_here` with the password you set for PostgreSQL.

## Running the Project

### Starting PostgreSQL

PostgreSQL should run as a service on Windows after installation. If it's not running:

1. Open Services (Win + R, type `services.msc`, press Enter)
2. Find "PostgreSQL" in the list
3. Right-click and select "Start"

Or via Command Prompt as Administrator:
```cmd
net start postgresql-x64-14
```
(Replace 14 with your PostgreSQL version)

### Running the Development Server

```cmd
npm run dev
```

### Testing the Connection

```cmd
npx ts-node src/scripts/testConnection.ts
```

## Using Docker on Windows

If you prefer Docker:

1. Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Enable WSL 2 if prompted
3. Run Docker Desktop
4. From your project directory in Command Prompt or PowerShell:
   ```cmd
   docker-compose up -d
   ```

## Troubleshooting Windows-Specific Issues

### PostgreSQL Connection Issues

If you can't connect to PostgreSQL:

1. Check if the service is running:
   ```cmd
   sc query postgresql-x64-14
   ```

2. Verify PostgreSQL is listening on port 5432:
   ```cmd
   netstat -ano | findstr 5432
   ```

3. Check the logs in Event Viewer:
   - Open Event Viewer (Win + R, type `eventvwr`, press Enter)
   - Navigate to Windows Logs > Application
   - Look for entries from PostgreSQL

### Node.js Permission Issues

If you encounter "EACCES" permission errors:

1. Run Command Prompt as Administrator
2. Try using a different port (not 3000) in your .env file

### Line Ending Issues with Git

Set Git to use LF line endings:
```cmd
git config --global core.autocrlf false
```

### Path Too Long Errors

Windows has path length limitations. If you encounter "path too long" errors:

1. Enable long paths in Windows:
   - Open Registry Editor (Win + R, type `regedit`, press Enter)
   - Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
   - Set `LongPathsEnabled` to `1`
   - Restart your computer

2. Or use Git Bash which handles long paths better than Command Prompt

## Windows Development Tips

1. **IDE Recommendation**:
   - Visual Studio Code works well on Windows for Node.js/TypeScript development
   - Install the ESLint, Prettier, and PostgreSQL extensions

2. **Terminal Alternative**:
   - Windows Terminal from the Microsoft Store provides a better experience
   - Git Bash provides Unix-like commands on Windows

3. **Database Management**:
   - pgAdmin is installed with PostgreSQL by default on Windows
   - Use it for visual database management

4. **Performance**:
   - Disable Windows Defender scanning for your project directory to improve performance
   - Use WSL2 for a more Linux-like development experience

5. **Network Issues**:
   - If you have firewall issues, make sure to allow Node.js and PostgreSQL through Windows Defender Firewall