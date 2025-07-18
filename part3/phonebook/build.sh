#!/bin/bash
# Build script for Unix/Linux systems

echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Copying build to backend..."
rm -rf dist
cp -r frontend/dist dist

echo "Build complete!"
