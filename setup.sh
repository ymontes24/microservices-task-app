#!/bin/bash

# Script to set up and run the Microservices Task App

echo "Setting up Microservices Task App..."

# Build and start all services
echo "Building and starting all services..."
docker-compose up -d --build

echo "Waiting for services to be ready..."
sleep 10

echo "====================================="
echo "Microservices Task App is now running!"
echo "====================================="
echo ""
echo "Access the application at: http://localhost"
echo ""
echo "APIs are available at:"
echo "- Auth Service: http://localhost:3001"
echo "- Task Service: http://localhost:3002"
echo ""
echo "MongoDB is available at: mongodb://localhost:27017"
echo ""
echo "To stop the application, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
echo "====================================="
