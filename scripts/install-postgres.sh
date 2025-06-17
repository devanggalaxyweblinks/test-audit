#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="mac"
    elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        OS="windows"
    else
        OS="unknown"
    fi
}

# Function to check if PostgreSQL 16 is installed
check_postgresql() {
    echo -e "${GREEN}Checking if PostgreSQL 16 is installed...${NC}"

    if command -v psql >/dev/null 2>&1; then
        INSTALLED_VERSION=$(psql -V | awk '{print $3}' | cut -d'.' -f1)
        if [[ "$INSTALLED_VERSION" == "16" ]]; then
            echo -e "${GREEN}PostgreSQL 16 is already installed.${NC}"
            return 0
        else
            echo -e "${RED}A different version of PostgreSQL ($INSTALLED_VERSION) is installed.${NC}"
            return 1
        fi
    else
        echo -e "${RED}PostgreSQL is not installed.${NC}"
        return 1
    fi
}

# Function to install PostgreSQL 16
install_postgresql() {
    detect_os

    case $OS in
        linux)
            echo -e "${GREEN}Detected OS: Linux. Installing PostgreSQL 16...${NC}"
            sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
            wget -qO - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
            sudo apt update
            sudo apt install -y postgresql-16 postgresql-client-16
            POSTGRES_BIN_PATH="/usr/lib/postgresql/16/bin"
            ;;
        mac)
            echo -e "${GREEN}Detected OS: macOS. Installing PostgreSQL 16 via Homebrew...${NC}"
            brew install postgresql@16
            brew link --force postgresql@16
            POSTGRES_BIN_PATH="/opt/homebrew/opt/postgresql@16/bin"
            ;;
        windows)
            echo -e "${GREEN}Detected OS: Windows. Please install PostgreSQL 16 manually from:${NC}"
            echo "https://www.enterprisedb.com/downloads/postgres-postgresql-downloads"
            return
            ;;
        *)
            echo -e "${RED}Unsupported OS. Please install PostgreSQL 16 manually.${NC}"
            return
            ;;
    esac

    # Set PATH for PostgreSQL
    if [[ "$OS" == "linux" || "$OS" == "mac" ]]; then
        echo -e "${GREEN}Setting PATH for PostgreSQL 16...${NC}"
        echo "export PATH=$POSTGRES_BIN_PATH:\$PATH" >> ~/.bashrc
        echo "export PATH=$POSTGRES_BIN_PATH:\$PATH" >> ~/.zshrc
        source ~/.bashrc
        source ~/.zshrc
    fi
}

# Run the check and install if necessary
if ! check_postgresql; then
    install_postgresql
fi

# Verify Installation
if command -v psql >/dev/null 2>&1; then
    echo -e "${GREEN}PostgreSQL 16 installation completed successfully.${NC}"
    psql --version
else
    echo -e "${RED}Error: PostgreSQL 16 installation failed.${NC}"
fi