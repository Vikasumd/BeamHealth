#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  BeamHealth MVP - Starting Services${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${RED}Shutting down services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set trap to catch SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Install backend dependencies if needed
echo -e "${GREEN}Checking Backend dependencies...${NC}"
cd beam-mvp
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    npm install
fi
cd ..

# Install frontend dependencies if needed
echo -e "${GREEN}Checking Frontend dependencies...${NC}"
cd beam-mvp-frontend
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
fi
cd ..

echo ""

# Start backend
echo -e "${GREEN}Starting Backend (beam-mvp)...${NC}"
cd beam-mvp
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}Starting Frontend (beam-mvp-frontend)...${NC}"
cd beam-mvp-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Backend running on http://localhost:5005${NC}"
echo -e "${GREEN}✓ Frontend running on http://localhost:5173${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for all background processes
wait
