# Khởi động tất cả services với Docker Compose

echo "  Starting Task App with Docker Compose"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "✗ Docker Compose is not installed"
    exit 1
fi

# Use 'docker compose' (v2) if available, otherwise 'docker-compose' (v1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo ""
echo "Using: $DOCKER_COMPOSE"
echo ""

# Pull latest images for infrastructure
echo "Pulling infrastructure images..."
$DOCKER_COMPOSE pull mysql mongodb rabbitmq consul

echo ""
echo "Building application images..."
$DOCKER_COMPOSE build

echo ""
echo "Starting all services..."
$DOCKER_COMPOSE up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo "  Service Status"
$DOCKER_COMPOSE ps

echo ""
echo "  ✓ Services Started!"
echo ""
echo "📍 API Gateway: http://localhost:8080/health"
echo "📍 User Service: http://localhost:8081/api/users"
echo "📍 Task Service: http://localhost:8082/health"
echo "📍 Notification Service: http://localhost:8083/health"
echo ""
echo "📍 RabbitMQ UI: http://localhost:15672 (admin/admin123)"
echo "📍 Consul UI: http://localhost:8500"
echo ""
echo "💡 View logs: $DOCKER_COMPOSE logs -f [service-name]"
echo "💡 Stop all: $DOCKER_COMPOSE down"
echo ""