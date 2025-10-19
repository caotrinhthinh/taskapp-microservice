# Dừng tất cả services

echo "  Stopping Task App Services"

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo "Stopping all services..."
$DOCKER_COMPOSE stop

echo ""
echo "Removing containers..."
$DOCKER_COMPOSE down

echo ""
echo "✓ All services stopped!"
echo ""
echo "💡 To remove volumes: $DOCKER_COMPOSE down -v"
echo "💡 To remove images: docker rmi \$(docker images -q 'task-app/*')"
