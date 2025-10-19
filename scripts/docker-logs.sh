# Xem logs của services

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

if [ -z "$1" ]; then
    echo "Usage: ./docker-logs.sh [service-name]"
    echo ""
    echo "Available services:"
    echo "  - user-service"
    echo "  - task-service"
    echo "  - notification-service"
    echo "  - api-gateway"
    echo "  - mysql"
    echo "  - mongodb"
    echo "  - rabbitmq"
    echo ""
    echo "Example: ./docker-logs.sh user-service"
    echo "All logs: ./docker-logs.sh --all"
    exit 1
fi

if [ "$1" == "--all" ]; then
    $DOCKER_COMPOSE logs -f
else
    $DOCKER_COMPOSE logs -f $1
fi
