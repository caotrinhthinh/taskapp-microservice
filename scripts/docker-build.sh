# Build tất cả Docker images
echo "  Building Docker Images"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Build User Service
echo ""
echo -e "${YELLOW}Building User Service...${NC}"
docker build -t task-app/user-service:latest ./user-service
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ User Service built successfully${NC}"
else
    echo "✗ User Service build failed"
    exit 1
fi

# Build Task Service
echo ""
echo -e "${YELLOW}Building Task Service...${NC}"
docker build -t task-app/task-service:latest ./task-service
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Task Service built successfully${NC}"
else
    echo "✗ Task Service build failed"
    exit 1
fi

# Build Notification Service
echo ""
echo -e "${YELLOW}Building Notification Service...${NC}"
docker build -t task-app/notification-service:latest ./notification-service
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Notification Service built successfully${NC}"
else
    echo "✗ Notification Service build failed"
    exit 1
fi

# Build API Gateway
echo ""
echo -e "${YELLOW}Building API Gateway...${NC}"
docker build -t task-app/api-gateway:latest ./api-gateway
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API Gateway built successfully${NC}"
else
    echo "✗ API Gateway build failed"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All images built successfully!${NC}"
echo ""
echo "Available images:"
docker images | grep task-app
