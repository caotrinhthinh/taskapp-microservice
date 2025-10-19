# Xóa tất cả containers, volumes, images

echo "⚠️  WARNING: This will remove all Task App Docker resources!"
echo ""
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo ""
echo "Stopping and removing containers..."
$DOCKER_COMPOSE down -v

echo ""
echo "Removing images..."
docker rmi $(docker images -q 'task-app/*') 2>/dev/null

echo ""
echo "Removing dangling images..."
docker image prune -f

echo ""
echo "✓ Cleanup complete!"
echo ""
echo "Rebuild: ./scripts/docker-build.sh"
echo "Start: ./scripts/docker-start.sh"