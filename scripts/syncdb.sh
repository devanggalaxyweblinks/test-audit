#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
YELLOW='\033[1;33m'

echo -e "${YELLOW}Database Sync Script${NC} \n\n"

# Prompt for remote database details with defaults
read -p "Enter remote database hostname [default: 34.46.113.148]: " REMOTE_DB_HOST
REMOTE_DB_HOST=${REMOTE_DB_HOST:-"34.46.113.148"}

read -p "Enter remote database username [default: postgres]: " REMOTE_DB_USER
REMOTE_DB_USER=${REMOTE_DB_USER:-"postgres"}

read -s -p "Enter remote database password [default: MyPassword]: " REMOTE_DB_PASSWORD
REMOTE_DB_PASSWORD=${REMOTE_DB_PASSWORD:-"MyPasswor"}
echo "" # New line for better formatting

read -p "Enter remote database name [default: o2c]: " REMOTE_DB_NAME
REMOTE_DB_NAME=${REMOTE_DB_NAME:-"o2c"}

read -p "Enter remote database port (default: 5432): " REMOTE_DB_PORT
REMOTE_DB_PORT=${REMOTE_DB_PORT:-5432}




# Prompt for local database details with defaults
read -p "Enter local database name [default: o2c_local]: " LOCAL_DB_NAME
LOCAL_DB_NAME=${LOCAL_DB_NAME:-"o2c_local"}

read -p "Enter local database username [default: postgres]: " LOCAL_DB_USER
LOCAL_DB_USER=${LOCAL_DB_USER:-"postgres"}

read -s -p "Enter local database password [default: MyPassword]: " LOCAL_DB_PASSWORD
LOCAL_DB_PASSWORD=${LOCAL_DB_PASSWORD:-"MyPassword"}
echo "" # New line for better formatting

read -p "Enter local database port (default: 5432): " LOCAL_DB_PORT
LOCAL_DB_PORT=${LOCAL_DB_PORT:-5432}

DUMP_FILE="${REMOTE_DB_NAME}_db_dump.sql"

echo -e "\n\n ${YELLOW}Starting database sync...${NC} \n\n "

# Step 1: Dump the remote database
echo -e "${GREEN}Dumping remote database...${NC}"
PGPASSWORD="$REMOTE_DB_PASSWORD" pg_dump -h "$REMOTE_DB_HOST" -p "$REMOTE_DB_PORT" -U "$REMOTE_DB_USER" -F c -b -v -f "$DUMP_FILE" "$REMOTE_DB_NAME"

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to dump remote database!${NC}"
  exit 1
fi

echo -e "${YELLOW}Remote database dump created successfully.${NC} \n\n"


# Step 2: Drop the local database
echo -e "${YELLOW}Checking if the database is in use...${NC} \n\n"

# Query to check for active connections
ACTIVE_CONNECTIONS=$(PGPASSWORD="$LOCAL_DB_PASSWORD" psql -h "localhost" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" -tAc "SELECT COUNT(*) FROM pg_stat_activity WHERE datname = '$LOCAL_DB_NAME';")

if [[ "$ACTIVE_CONNECTIONS" -gt 0 ]]; then
    echo -e "${RED}Warning: Database \"$LOCAL_DB_NAME\" is currently accessed by $ACTIVE_CONNECTIONS active sessions.${NC}"
    echo -e "${GREEN}Attempting to terminate all active connections...${NC}"

    # Terminate all active connections
    PGPASSWORD="$LOCAL_DB_PASSWORD" psql -h "localhost" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$LOCAL_DB_NAME' AND pid <> pg_backend_pid();"

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to terminate active connections.${NC}"
        exit 1
    fi

    echo -e "${GREEN}All active connections terminated successfully.${NC}"
else
    echo -e "${GREEN}No active connections found. Proceeding...${NC}"
fi

echo -e "${YELLOW}No active sessions found. Proceeding with database drop.${NC}"

# Drop the database
echo -e "${YELLOW}Dropping local database...${NC}"
PGPASSWORD="$LOCAL_DB_PASSWORD" psql -h "localhost" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -c "DROP DATABASE IF EXISTS $LOCAL_DB_NAME;"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to drop the database.${NC}"
    exit 1
fi

echo -e "${YELLOW}Database dropped successfully.${NC} \n\n"


# Step 3: Create a new local database
echo -e "${YELLOW}Creating new local database...${NC}"
PGPASSWORD="$LOCAL_DB_PASSWORD" psql -h "localhost" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -c "CREATE DATABASE $LOCAL_DB_NAME;"

# Step 4: Restore the dump to the local database
echo -e "${YELLOW}Restoring dump into local database...${NC}"
PGPASSWORD="$LOCAL_DB_PASSWORD" pg_restore -h "localhost" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" -v --exclude-schema=sqitch "$DUMP_FILE"

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to restore the database!${NC}"
  exit 1
fi

echo -e "\n\n ${YELLOW}Database synchronization completed successfully.${NC} \n\n"


