# Build script for Windows PowerShell

Write-Host "Building frontend..."
Set-Location frontend
npm run build
Set-Location ..

Write-Host "Copying build to backend..."
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "frontend\dist" -Destination "dist" -Recurse

Write-Host "Build complete!"
