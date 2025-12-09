#!/bin/bash

echo "🚀 AREA Backend - Quick Start Script"
echo "===================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if we're in the project root
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Building and starting services..."
echo ""

# Build and start services
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "area_server"; then
    echo ""
    echo "✅ Backend services are running!"
    echo ""
    echo "📍 Service URLs:"
    echo "   - Backend API: http://localhost:8080"
    echo "   - Frontend Web: http://localhost:8081"
    echo "   - PostgreSQL: localhost:5432"
    echo ""
    echo "🧪 Test the API:"
    echo "   curl http://localhost:8080"
    echo "   curl http://localhost:8080/about.json"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f server"
    echo ""
    echo "🛑 Stop services:"
    echo "   docker-compose down"
    echo ""
else
    echo "❌ Failed to start services. Check logs with:"
    echo "   docker-compose logs"
fi
