# Restart một service cụ thể

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

if [ -z "$1" ]; then
    echo "Usage: ./docker-restart.sh [service-name]"
    echo ""
    echo "Available services:"
    echo "  - user-service"
    echo "  - task-service"
    echo "  - notification-service"
    echo "  - api-gateway"
    exit 1
fi

echo "Restarting $1..."
$DOCKER_COMPOSE restart $1

echo ""
echo "✓ $1 restarted!"
echo ""
echo "View logs: $DOCKER_COMPOSE logs -f $1"